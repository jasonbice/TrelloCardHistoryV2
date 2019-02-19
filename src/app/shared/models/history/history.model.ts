import { HistoryItem } from './history-item.model';
import { ITrelloHistoryDataObj } from '../trello/trello-history-data-obj.model';

export class History {
    id: string;
    lastViewed: Date;
    historyItems: HistoryItem[] = new Array<HistoryItem>();
    newUpdates: number;
    title: string;
    
    get totalUpdateCount(): number {
        return this.historyItems.filter(h => h.updateType !== 'createCard').length;
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
        return this.historyItems.sort((a, b) => {
            if (a.trelloHistoryDataObj.date > b.trelloHistoryDataObj.date) {
                return 1;
            } else if (a.trelloHistoryDataObj.date < b.trelloHistoryDataObj.date) {
                return -1;
            }

            return 0;
        })[0];
    }
}