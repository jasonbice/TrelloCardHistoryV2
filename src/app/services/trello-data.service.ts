import { Injectable, EventEmitter } from '@angular/core';
import { ITrelloHistoryDataObj } from '../shared/models/trello/trello-history-data-obj.model';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, flatMap } from 'rxjs/operators';
import { History } from '../shared/models/history/history.model';
import { LegacyCoreService } from './legacy-core.service';
import deepcopy from 'deepcopy';
import { UpdateType } from '../shared/models/history/history-item.model';
import { bindCallback, Observable, throwError, forkJoin } from 'rxjs';
import { CardUpdatedEventArgs } from '../shared/models/card-updated-event-args.model';
import { ITrelloCard } from '../shared/models/trello/trello-card.model';
import { Utils } from '../shared/utils';

/**
 * The maximium number of card data items the extension is permitted to keep in browser storage
 */
export const STORAGE_LIMIT_CARD_DATA_ITEMS = 1000;

@Injectable({
  providedIn: 'root'
})
export class TrelloDataService {
  cardUpdated = new EventEmitter<CardUpdatedEventArgs>();

  constructor(private http: HttpClient, private coreService: LegacyCoreService) { }

  private handleError(error: HttpErrorResponse) {
    LegacyCoreService.console.log("Error", error);

    return throwError(`Something bad happened: ${error.status} - ${error.statusText} / ${error.error}`);
  };

  private getTrellowAuthTokenCookie(): Observable<chrome.cookies.Cookie> {
    const getCookie = bindCallback(chrome.cookies.get);

    return getCookie({ url: 'https://trello.com', name: "token" });
  }

  getHistoryRequestUri(shortLink: string): string {
    return `${this.getTrelloCardRequestUri(shortLink)}/actions?filter=createCard,copyCard,convertToCardFromCheckItem,updateCard&limit=1000`;
  }

  getTrelloCardRequestUri(shortLink: string): string {
    return `https://trello.com/1/cards/${shortLink}`;
  }

  getCardUpdateUri(id: string): string {
    return `https://trello.com/1/cards/${id}`;
  }

  getHistory(shortLink: string): Observable<History> {
    const trelloCardDataUri: string = this.getTrelloCardRequestUri(shortLink);
    const actionsDataUri: string = this.getHistoryRequestUri(shortLink);

    return forkJoin({
      trelloCard: this.http.get<ITrelloCard>(trelloCardDataUri),
      historyData: this.http.get<ITrelloHistoryDataObj[]>(actionsDataUri)
    }).pipe(
      map(o => new History(o.trelloCard, o.historyData.filter(t =>
        t.data.card.shortLink == shortLink && ( // Need to filter on shortLink so convertToCardFromCheckItem entries from the *new* card are not included
          (t.type !== 'updateCard' || (!t.data.old.idList && (t.data.old.name || t.data.card.desc || t.data.old.desc)))))
      )));
  }

  updateCard(history: History, id: string, updateType: UpdateType, newValue: any): Observable<any> {
    const cardUpdateUri: string = this.getCardUpdateUri(id);
    let paramName: string = null;
    let _newValue: string = newValue;

    switch (updateType) {
      case UpdateType.Description:
        paramName = "desc";

        break;

      case UpdateType.Points:
        paramName = "name";

        _newValue = `(${newValue}) ${Utils.getSanitizedTitle(history.title)}`;

        break;

      case UpdateType.Title:
        paramName = "name";

        if (history.points) {
          _newValue = `(${history.points}) ${Utils.getSanitizedTitle(newValue)}`;
        }

        break;
    }

    return this.getTrellowAuthTokenCookie().pipe(flatMap((tokenCookie) => {
      const token: string = decodeURIComponent(tokenCookie.value);
      const httpParams: HttpParams = new HttpParams().set(paramName, _newValue).set("token", token);

      return this.http.put(cardUpdateUri, httpParams).pipe(
        catchError(this.handleError)
      );
    }));
  }

  applyLastViewedToHistory(history: History, refresh: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getCardDataFromLocalStorage().then((cardData) => {
        let cardDataItem = {
          cardId: history.id,
          lastViewed: null
        };

        let cardDataItemPos;

        for (const i in cardData) {
          if (cardData[i].cardId == history.id) {
            cardDataItem = cardData[i];
            cardDataItemPos = i;

            break;
          }
        }

        if (cardDataItem.lastViewed) {
          history.lastViewed = new Date(cardDataItem.lastViewed);
          history.historyItems.map(historyItem => historyItem.isNew = historyItem.trelloHistoryDataObj.date > history.lastViewed);
        }

        if (refresh) {
          try {
            cardDataItem.lastViewed = new Date().toUTCString();

            if (cardDataItemPos >= 0) {
              cardData[cardDataItemPos] = cardDataItem;
            } else {
              cardData.push(cardDataItem);
            }

            this.saveCardDataToLocalStorage(cardData, null);
          } catch (err) {
            LegacyCoreService.console.error(err);
          }
        }
      }).catch((err) => {

      }).finally(() => {
        resolve();
      });
    });
  }

  /**
    * Gets the card data from storage
    */
  getCardDataFromLocalStorage(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.coreService.storage.get("cardData", (result) => {
        if (!result.cardData) {
          result.cardData = [];
        }

        resolve(result.cardData);
      });
    });
  }

  /**
  * Saves the card data to storage
  * @param {function():void} callback - Function to invoke once the save has completed
  */
  saveCardDataToLocalStorage(cardData, callback): void {
    this.coreService.storage.set({ cardData: cardData }, callback);
  }

  /**
  * Purges storage of the minimum number of ("old") items necessary to remain under STORAGE_LIMIT_CARD_DATA_ITEMS
  */
  cleanUpLocalStorage(): void {
    this.getCardDataFromLocalStorage().then((cardData) => {
      if (cardData.length === 0) {
        return;
      }

      const cardDataStorageInfo = {
        cardDataItems: cardData.length,
        itemLimit: STORAGE_LIMIT_CARD_DATA_ITEMS,
        cardDataStorageBytes: JSON.stringify(cardData).length,
        averageCardDataItemSizeBytes: null,
        itemsToCleanUp: null,
        cleanUpStartIndex: null
      };

      cardDataStorageInfo.averageCardDataItemSizeBytes = cardDataStorageInfo.cardDataStorageBytes / cardData.length;
      cardDataStorageInfo.itemsToCleanUp = Math.max(cardData.length - STORAGE_LIMIT_CARD_DATA_ITEMS, 0);
      cardDataStorageInfo.cleanUpStartIndex = deepcopy(cardData.length - cardDataStorageInfo.itemsToCleanUp - 1);

      if (cardDataStorageInfo.itemsToCleanUp) {
        cardData.sort((a, b) => new Date(a.lastViewed).valueOf() - new Date(b.lastViewed).valueOf());
        cardData.splice(cardDataStorageInfo.cleanUpStartIndex, cardDataStorageInfo.itemsToCleanUp);

        if (chrome.storage) {
          this.saveCardDataToLocalStorage(cardData, null);
        }
      }
    });
  }

  /**
  * Performs a wholesale reset of the extension's storage
  */
  clearLocalStorage(): void {
    this.coreService.storage.clear();
  }
}