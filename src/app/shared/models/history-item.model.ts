import { ITrelloHistoryDataObj } from './trello/trello-history-data-obj.model';
import { ITrelloHistoryData } from './trello/trello-history-data.model';

export class HistoryItem {
    isNew: boolean;
    updateType: string;
    sanitizedOldTitle: string;
    sanitizedNewTitle: string;
    sanitizedOldPoints?: number;
    sanitizedNewPoints?: number;

    get oldValue(): any {
        switch (this.updateType) {
            case 'Created': return null;
            case 'Description': return null;
            case 'Points': return this.sanitizedOldPoints;
            case 'Title': return this.sanitizedOldTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }
    
    get newValue(): any {
        switch (this.updateType) {
            case 'Created': return null;
            case 'Description': return null;
            case 'Points': return this.sanitizedNewPoints;
            case 'Title': return this.sanitizedNewTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    constructor(public trelloHistoryDataObj: ITrelloHistoryDataObj) {
        this.sanitizedNewPoints = this.getSanitizedPoints(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewTitle = this.getSanitizedTitle(this.trelloHistoryDataObj.data.card.name);

        if (this.trelloHistoryDataObj.data.old) {
            this.sanitizedOldPoints = this.getSanitizedPoints(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldTitle = this.getSanitizedTitle(this.trelloHistoryDataObj.data.old.name);
        }

        this.updateType = this.getUpdateType();
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

        let rawPoints: any = /^\(\d+\)/g.exec(rawTitle);

        if (rawPoints == null) {
            return null;
        }

        let points: number = rawTitle.match(/\d+/g).map(Number)[0];

        return points;
    }

    getUpdateType(): string {
        if (this.trelloHistoryDataObj.type === 'createCard') {
            return "Created";
        } else if (this.trelloHistoryDataObj.type === 'updateCard') {
            if (this.trelloHistoryDataObj.data.card.desc != this.trelloHistoryDataObj.data.old.desc) {
                return "Description";
            } else if (this.sanitizedNewPoints != this.sanitizedOldPoints) {
                return "Points";
            } else if (this.sanitizedNewTitle != this.sanitizedOldTitle) {
                return "Title";
            }
        } else {
            console.error(`Unexpected data.type: ${this.trelloHistoryDataObj.type}`, this);

            throw new Error(`Unexpected data.type: ${this.trelloHistoryDataObj.type}`);
        }
    }
}