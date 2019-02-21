import { ITrelloHistoryDataObj } from '../trello/trello-history-data-obj.model';

export enum UpdateType {
    Created = 'Created',
    Description = 'Description',
    Points = 'Points',
    Title = 'Title'
}

export class HistoryItem {
    updateType: UpdateType;
    sanitizedOldDescription: string;
    sanitizedNewDescription: string;
    sanitizedOldTitle: string;
    sanitizedNewTitle: string;
    sanitizedOldPoints?: number;
    sanitizedNewPoints?: number;

    get oldValue(): string {
        switch (this.updateType) {
            case 'Created': return null;
            case 'Description': return this.sanitizedOldDescription;
            case 'Points': return String(this.sanitizedOldPoints ? this.sanitizedOldPoints + ' points' : 'None');
            case 'Title': return this.sanitizedOldTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    get newValue(): string {
        switch (this.updateType) {
            case 'Created': return null;
            case 'Description': return this.sanitizedNewDescription;
            case 'Points': return String(this.sanitizedNewPoints ? this.sanitizedNewPoints + ' points' : 'None');
            case 'Title': return this.sanitizedNewTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    constructor(public trelloHistoryDataObj: ITrelloHistoryDataObj) {
        this.initialize();
    }

    initialize(): void {
        this.sanitizedNewPoints = this.getSanitizedPoints(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewTitle = this.getSanitizedTitle(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewDescription = this.getSanitizedDescription(this.trelloHistoryDataObj.data.card.desc);

        if (this.trelloHistoryDataObj.data.old) {
            this.sanitizedOldPoints = this.getSanitizedPoints(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldTitle = this.getSanitizedTitle(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldDescription = this.getSanitizedDescription(this.trelloHistoryDataObj.data.old.desc);
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

        let pointsRegEx: RegExpExecArray = /^\((\d+)\)/g.exec(rawTitle);

        if (pointsRegEx && pointsRegEx[1]) {
            return +pointsRegEx[1];
        }

        return null;
    }

    getSanitizedDescription(description: string): string {
        // TODO: Preserve formatting
        return description;
    }

    getUpdateType(): UpdateType {
        if (this.trelloHistoryDataObj.type === 'createCard') {
            return UpdateType.Created;
        } else if (this.trelloHistoryDataObj.type === 'updateCard') {
            if (this.trelloHistoryDataObj.data.card.desc != this.trelloHistoryDataObj.data.old.desc) {
                return UpdateType.Description;
            } else if (this.sanitizedNewPoints != this.sanitizedOldPoints) {
                return UpdateType.Points;
            } else if (this.sanitizedNewTitle != this.sanitizedOldTitle) {
                return UpdateType.Title;
            }
        } else {
            throw new Error(`Unexpected data.type: ${this.trelloHistoryDataObj.type}`);
        }
    }
}