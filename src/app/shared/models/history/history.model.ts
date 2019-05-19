import { HistoryItem, UpdateType } from './history-item.model';
import { ITrelloHistoryDataObj } from '../trello/trello-history-data-obj.model';
import { Utils } from '../../utils';
import { ITrelloCard } from '../trello/trello-card.model';

export class History {
    id: string;
    lastViewed: Date;
    historyItems: HistoryItem[] = new Array<HistoryItem>();
    newUpdates: number;
    title: string;
    points?: number;
    description?: string;

    get totalUpdateCount(): number {
        return this.historyItems.filter(h => h.updateType !== UpdateType.Created).length;
    }

    get newHistoryItems(): number {
        return this.historyItems.filter(h => h.trelloHistoryDataObj.date > this.lastViewed).length;
    }

    constructor(trelloCard: ITrelloCard, trelloHistoryItemObjects: ITrelloHistoryDataObj[]) {
        this.id = trelloCard.shortLink;
        this.title = trelloCard.name;
        this.description = trelloCard.desc;
        this.points = Utils.getSanitizedPoints(trelloCard.name);

        for (const trelloHistoryItemObj of trelloHistoryItemObjects) {
            const historyItem = new HistoryItem(trelloHistoryItemObj);

            this.historyItems.push(historyItem);
        }
    }

    containsChangesOfType(updateType: UpdateType): boolean {
        if (!this.historyItems || this.historyItems.length === 0) {
            return false;
        }

        return this.historyItems.findIndex(h => h.updateType === updateType) > -1;
    }
}