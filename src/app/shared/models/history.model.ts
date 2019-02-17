import { HistoryItem } from './history-item.model';
import { ITrelloHistoryDataObj } from './trello/trello-history-data-obj.model';

export class History {
    id: string;
    lastViewed: Date;
    historyItems: HistoryItem[];
    badgeColor: string;
    badgeText: string;
    totalUpdateCount: number;
    newUpdates: number;

    constructor(shortLink: string, trelloHistoryItemObjects: ITrelloHistoryDataObj[]) {
        this.id = shortLink;

        for (let trelloHistoryItemObj of trelloHistoryItemObjects) {
            this.historyItems.push(new HistoryItem(trelloHistoryItemObj));
        }
    }
}