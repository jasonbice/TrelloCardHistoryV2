import { Injectable } from '@angular/core';
import { ITrelloHistoryDataObj } from '../shared/models/trello/trello-history-data-obj.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { History } from '../shared/models/history/history.model';
import { LegacyCoreService } from './legacy-core.service';
import deepcopy from 'deepcopy';

/**
 * The maximium number of card data items the extension is permitted to keep in browser storage
 */
export const STORAGE_LIMIT_CARD_DATA_ITEMS = 1000;

@Injectable({
  providedIn: 'root'
})
export class TrelloDataService {

  constructor(private http: HttpClient, private coreService: LegacyCoreService) { }

  getRequestUri(shortLink: string): string {
    return `https://trello.com/1/cards/${shortLink}/actions?filter=createCard,convertToCardFromCheckItem,updateCard&limit=1000`
  }

  getHistory(shortLink: string): Observable<History> {
    const cardDataUri = this.getRequestUri(shortLink);

    console.log(`Fetching card data for ${shortLink}`, cardDataUri);

    return this.http.get<ITrelloHistoryDataObj[]>(cardDataUri).pipe(
      map<ITrelloHistoryDataObj[], History>(trelloHistoryDataObjects => new History(shortLink, trelloHistoryDataObjects.filter(t =>
        t.data.card.shortLink == shortLink && ( // Need to filter on shortLink so convertToCardFromCheckItem entries from the *new* card are not included
          t.type === 'createCard' ||
          t.type === 'convertToCardFromCheckItem' ||
          (t.type === 'updateCard' && !t.data.old.idList && (t.data.old.name || t.data.card.desc || t.data.old.desc)))
      )))
    );
  }

  applyLastViewedToHistory(history: History, refresh: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getCardDataFromLocalStorage().then((cardData) => {
        let cardDataItem = {
          cardId: history.id,
          lastViewed: null
        };

        let cardDataItemPos;

        for (let i in cardData) {
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
            this.coreService.console.error(err);
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