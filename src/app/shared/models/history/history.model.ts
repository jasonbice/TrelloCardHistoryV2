import { HistoryItem, UpdateType } from './history-item.model';
import { ITrelloHistoryDataObj } from '../trello/trello-history-data-obj.model';

export class History {
    id: string;
    lastViewed: Date;
    historyItems: HistoryItem[] = new Array<HistoryItem>();
    newUpdates: number;
    title: string;
    
    get totalUpdateCount(): number {
        return this.historyItems.filter(h => h.updateType !== UpdateType.Created).length;
    }

    get newHistoryItems(): number {
        return this.historyItems.filter(h => h.trelloHistoryDataObj.date > this.lastViewed).length;
    }

    constructor(shortLink: string, trelloHistoryItemObjects: ITrelloHistoryDataObj[]) {
        this.id = shortLink;

        for (let trelloHistoryItemObj of trelloHistoryItemObjects) {
            let historyItem = new HistoryItem(trelloHistoryItemObj);

            this.historyItems.push(historyItem);
        }

        this.title = this.getMostRecentHistoryItem().sanitizedNewTitle;
    }

    getMostRecentHistoryItem(): HistoryItem {
        let maxDate: Date = this.historyItems.reduce((max, p) => p.trelloHistoryDataObj.date > max ? p.trelloHistoryDataObj.date : max, this.historyItems[0].trelloHistoryDataObj.date);

        return this.historyItems.filter((h) => h.trelloHistoryDataObj.date === maxDate)[0];
    }

    containsChangesOfType(updateType: UpdateType): boolean {
        if (!this.historyItems || this.historyItems.length === 0) {
            return false;
          }
      
          return this.historyItems.findIndex(h => h.updateType === updateType) > -1;
    }
}