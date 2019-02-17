import { ITrelloHistoryDataObj } from './trello/trello-history-data-obj.model';
import { ITrelloHistoryData } from './trello/trello-history-data.model';

export enum UpdateType {
    Created,
    Description,
    Name,
    Points
}

export class HistoryItem {
    isNew: boolean;
    updateType: UpdateType;
    sanitizedOldTitle: string;
    sanitizedNewTitle: string;
    sanitizedOldPoints?: number;
    sanitizedNewPoints?: number;
    oldValue: string;
    newValue: string;

    constructor(public trelloHistoryDataObj: ITrelloHistoryDataObj) {
        this.sanitizedNewPoints = this.getSanitizedPoints(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewTitle = this.getSanitizedTitle(this.trelloHistoryDataObj.data.card.name);

        if (this.trelloHistoryDataObj.data.old) {
            this.sanitizedOldPoints = this.getSanitizedPoints(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldTitle = this.getSanitizedTitle(this.trelloHistoryDataObj.data.old.name);
        }        
    }

    getSanitizedTitle(rawTitle: string): string {
        if (rawTitle == null) {
            return null;
        }

        return rawTitle.substring(rawTitle.indexOf(')') + 1).trim();
    }

    getSanitizedPoints(rawTitle: string): number {
        if (rawTitle == null) {
            return null;
        }
        
        return +(/^\(\d+\)/g.exec(rawTitle));
    }

    getUpdateType(data: ITrelloHistoryData): UpdateType {
        if (data.type === 'createCard') {
            return UpdateType.Created;
        } else if (data.type === 'updateCard') {
            if (data.card.desc != data.old.desc) {
                return UpdateType.Description;
            } else if (this.sanitizedNewPoints != this.sanitizedOldPoints) {
                return UpdateType.Points;
            } else if (this.sanitizedNewTitle != this.sanitizedOldTitle) {
                return UpdateType.Name;
            }
        } else {
            throw new Error(`Unexpected data.type: ${data.type}`);
        }
    }
}