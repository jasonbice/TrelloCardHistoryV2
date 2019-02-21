import { Injectable } from '@angular/core';
import { ITrelloHistoryDataObj } from '../shared/models/trello/trello-history-data-obj.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { History } from '../shared/models/history/history.model';
import { LegacyCoreService, BADGE_COLOR_CHANGES, BADGE_COLOR_CHANGES_NONE, TITLE, BADGE_COLOR_UNSEEN, BADGE_COLOR_CHANGES_NEW } from './legacy-core.service';

@Injectable({
  providedIn: 'root'
})
export class TrelloDataService {

  constructor(private http: HttpClient, private coreService: LegacyCoreService) { }

  getRequestUri(shortLink: string): string {
    return `https://trello.com/1/cards/${shortLink}/actions?filter=createCard,convertToCardFromCheckItem,updateCard&limit=1000`
  }

  getHistory(shortLink: string): Observable<History> {
    let cardDataUri = this.getRequestUri(shortLink);

    return this.http.get<ITrelloHistoryDataObj[]>(cardDataUri).pipe(
      map<ITrelloHistoryDataObj[], History>(trelloHistoryDataObjects => new History(shortLink, trelloHistoryDataObjects.filter(t => 
        t.type === 'createCard' ||
        (t.type === 'updateCard' && !t.data.old.idList && (t.data.old.name || t.data.old.desc)) // Exclude updateCard events that don't update the description or title (such as list moves, due date changes, etc.)
      )))
    );
  }

  applyLastViewedToHistory(history: History, refresh: boolean, callback): void {
    this.coreService.getCardData((cardData) => {
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
      }

      if (refresh) {
        try {
          cardDataItem.lastViewed = new Date().toUTCString();

          if (cardDataItemPos >= 0) {
            cardData[cardDataItemPos] = cardDataItem;
          } else {
            cardData.push(cardDataItem);
          }

          this.coreService.saveCardData(cardData, null);
        } catch (err) {
          this.coreService.console.error(err);
        }
      }

      if (callback) {
        callback();
      }
    });
  };
}