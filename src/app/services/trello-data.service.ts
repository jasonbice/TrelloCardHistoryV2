import { Injectable, EventEmitter } from '@angular/core';
import { ITrelloHistoryDataObj } from '../shared/models/trello/trello-history-data-obj.model';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, flatMap, tap } from 'rxjs/operators';
import { History } from '../shared/models/history/history.model';
import deepcopy from 'deepcopy';
import { UpdateType } from '../shared/models/history/history-item.model';
import { bindCallback, Observable, throwError, forkJoin, of } from 'rxjs';
import { CardUpdatedEventArgs } from '../shared/models/card-updated-event-args.model';
import { ITrelloCard } from '../shared/models/trello/trello-card.model';
import { Utils } from '../shared/utils';
import { ExtensionHostService } from './extension-host.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrelloDataService {
  static readonly STORAGE_KEY_CARD_DATA = 'cardData';

  static readonly BASE_OPEN_CARD_URL = 'https://trello.com/c/';

  static readonly TRELLO_CARD_ID_BEGIN_IDX = TrelloDataService.BASE_OPEN_CARD_URL.length;

  /**
  * The maximium number of card data items the extension is permitted to keep in browser storage
  */
  static readonly STORAGE_LIMIT_CARD_DATA_ITEMS = 1000;

  cardUpdated = new EventEmitter<CardUpdatedEventArgs>();

  constructor(private http: HttpClient, private extensionHostService: ExtensionHostService, private storageService: StorageService) { }

  private handleError(error: HttpErrorResponse) {
    this.extensionHostService.console.log('Error', error);

    return throwError(`Something bad happened: ${error.status} - ${error.statusText} / ${error.error}`);
  };

  private getTrellowAuthTokenCookie(): Observable<chrome.cookies.Cookie> {
    const getCookie = bindCallback(chrome.cookies.get);

    return getCookie({ url: 'https://trello.com', name: 'token' });
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

  getTrelloCardUrl(shortLink: string): string {
    return `https://trello.com/c/${shortLink}`;
  }

  getTrelloCardIdFromUrl(trelloCardUrl: string): string {
    if (!trelloCardUrl.startsWith(TrelloDataService.BASE_OPEN_CARD_URL)) {
      return null;
    }

    const endOfCardIdIdx = trelloCardUrl.indexOf('/', TrelloDataService.TRELLO_CARD_ID_BEGIN_IDX + 1);
    const trelloCardId = trelloCardUrl.substring(TrelloDataService.TRELLO_CARD_ID_BEGIN_IDX, endOfCardIdIdx);

    return trelloCardId;
  }

  getTrelloCardIdFromCurrentUrl(): Observable<string> {
    return this.extensionHostService.getCurrentUrl().pipe(
      map(url => this.getTrelloCardIdFromUrl(url))
    );
  }

  getHistory(shortLink: string, refreshLastViewed: boolean = false): Observable<History> {
    const trelloCardDataUri: string = this.getTrelloCardRequestUri(shortLink);
    const actionsDataUri: string = this.getHistoryRequestUri(shortLink);

    return forkJoin({
      trelloCard: this.http.get<ITrelloCard>(trelloCardDataUri),
      historyData: this.http.get<ITrelloHistoryDataObj[]>(actionsDataUri)
    }).pipe(
      map(o => new History(o.trelloCard, o.historyData.filter(t =>
        t.data.card.shortLink == shortLink && ( // Need to filter on shortLink so convertToCardFromCheckItem entries from the *new* card are not included
          (t.type !== 'updateCard' || (!t.data.old.idList && (t.data.old.name || t.data.card.desc || t.data.old.desc)))))
      ))).pipe(
        flatMap(h => {
          return this.applyLastViewedToHistory(h, refreshLastViewed)
        })
      );
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
      const httpParams: HttpParams = new HttpParams().set(paramName, _newValue).set('token', token);

      return this.http.put(cardUpdateUri, httpParams).pipe(
        catchError(this.handleError)
      );
    }));
  }

  private applyLastViewedToHistory(history: History, refreshLastViewed: boolean): Observable<History> {
    return this.storageService.get(TrelloDataService.STORAGE_KEY_CARD_DATA).pipe(
      tap(cd => {
        let cardDataItem = {
          cardId: history.id,
          lastViewed: null
        };

        let cardDataItemPos;

        for (const i in cd) {
          if (cd[i].cardId == history.id) {
            cardDataItem = cd[i];
            cardDataItemPos = i;

            break;
          }
        }

        if (cardDataItem.lastViewed) {
          history.lastViewed = new Date(cardDataItem.lastViewed);
          history.historyItems.map(historyItem => historyItem.isNew = historyItem.trelloHistoryDataObj.date > history.lastViewed);
        }

        if (refreshLastViewed) {
          cardDataItem.lastViewed = new Date().toUTCString();

          if (cardDataItemPos >= 0) {
            cd[cardDataItemPos] = cardDataItem;
          } else {
            cd.push(cardDataItem);
          }

          this.storageService.set({ cardData: cd }).subscribe();
        }
      }),
      map(cd => history)
    );
  }

  /**
  * Purges storage of the minimum number of ("old") items necessary to remain under STORAGE_LIMIT_CARD_DATA_ITEMS
  */
  cleanUpLocalStorage(): Observable<any> {
    return this.storageService.get(TrelloDataService.STORAGE_KEY_CARD_DATA).pipe(
      tap(cd => {
        if (cd.length === 0) {
          return;
        }

        const cardDataStorageInfo = {
          cardDataItems: cd.length,
          itemLimit: TrelloDataService.STORAGE_LIMIT_CARD_DATA_ITEMS,
          cardDataStorageBytes: JSON.stringify(cd).length,
          averageCardDataItemSizeBytes: null,
          itemsToCleanUp: null,
          cleanUpStartIndex: null
        };

        cardDataStorageInfo.averageCardDataItemSizeBytes = Math.round(cardDataStorageInfo.cardDataStorageBytes / cd.length);
        cardDataStorageInfo.itemsToCleanUp = Math.max(cd.length - TrelloDataService.STORAGE_LIMIT_CARD_DATA_ITEMS, 0);
        cardDataStorageInfo.cleanUpStartIndex = cardDataStorageInfo.itemsToCleanUp > 0 ? deepcopy(cd.length - cardDataStorageInfo.itemsToCleanUp - 1) : null;

        if (cardDataStorageInfo.itemsToCleanUp) {
          cd.sort((a, b) => new Date(a.lastViewed).valueOf() - new Date(b.lastViewed).valueOf());
          cd.splice(cardDataStorageInfo.cleanUpStartIndex, cardDataStorageInfo.itemsToCleanUp);
        }

        cd.cardDataStorageInfo = cardDataStorageInfo;

        this.extensionHostService.console.debug("Storage clean-up status", cd.cardDataStorageInfo);
      }),
      flatMap(cd => {
        if (cd.cardDataStorageInfo.itemsToCleanUp) {
          delete cd.cardDataStorageInfo.itemsToCleanUp;

          return this.storageService.set(cd);
        } else {
          return of();
        }
      })
    );
  }
}