import { ITrelloHistoryDataObj } from '../trello/trello-history-data-obj.model';

export enum UpdateType {
    Created = 'Created',
    Description = 'Description',
    Points = 'Points',
    Title = 'Title'
}

export enum SortBy {
    Date
}

export class HistoryItem {
    isNew: boolean;
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
            case 'Points': return String(this.sanitizedOldPoints ? this.sanitizedOldPoints + ' points' : '');
            case 'Title': return this.sanitizedOldTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    get newValue(): string {
        switch (this.updateType) {
            case 'Created': return null;
            case 'Description': return this.sanitizedNewDescription;
            case 'Points': return String(this.sanitizedNewPoints ? this.sanitizedNewPoints + ' points' : '');
            case 'Title': return this.sanitizedNewTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    get updateType(): UpdateType {
        if (!this.trelloHistoryDataObj) {
            return null;
        }
        
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

    constructor(public trelloHistoryDataObj: ITrelloHistoryDataObj) {
        this.trelloHistoryDataObj.type = this.trelloHistoryDataObj.type === 'convertToCardFromCheckItem' ? 'createCard' : this.trelloHistoryDataObj.type;

        this.initialize();
    }

    initialize(): void {
        this.sanitizedNewPoints = HistoryItem.getSanitizedPoints(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewTitle = HistoryItem.getSanitizedTitle(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewDescription = HistoryItem.getSanitizedDescription(this.trelloHistoryDataObj.data.card.desc);

        if (this.trelloHistoryDataObj.data.old) {
            this.sanitizedOldPoints = HistoryItem.getSanitizedPoints(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldTitle = HistoryItem.getSanitizedTitle(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldDescription = HistoryItem.getSanitizedDescription(this.trelloHistoryDataObj.data.old.desc);
        }

        this.trelloHistoryDataObj.date = new Date(this.trelloHistoryDataObj.date);
    }

    static getPointsRegExp(): RegExp {
        return new RegExp(/^\((\d+)\)/g);
    }

    static getSanitizedTitle(rawTitle: string): string {
        if (rawTitle == null) {
            return null;
        }

        const trimmedTitle = rawTitle.trim();
        const pointsRegEx: RegExpExecArray = HistoryItem.getPointsRegExp().exec(trimmedTitle);

        if (pointsRegEx && pointsRegEx[0]) {
            return trimmedTitle.substring(pointsRegEx[0].length).trim();
        }

        return rawTitle;
    }

    static getSanitizedPoints(rawTitle: string): number {
        if (rawTitle == null) {
            return null;
        }

        const trimmedTitle = rawTitle.trim();
        const pointsRegEx: RegExpExecArray = HistoryItem.getPointsRegExp().exec(trimmedTitle);

        if (pointsRegEx && pointsRegEx[1]) {
            return +pointsRegEx[1];
        }

        return null;
    }

    static getSanitizedDescription(description: string): string {
        if (description) {
            return description.replace(/\n/g, '<br />').replace(/[\r]/g, '<br />');
        }

        return description;
    }

    static sort(historyItems: HistoryItem[], sortBy: SortBy, ascending: boolean): void {
        switch (sortBy) {
            case SortBy.Date:
                {
                    historyItems.sort((a, b) => {
                        if (a.trelloHistoryDataObj.date > b.trelloHistoryDataObj.date) {
                            return ascending ? 1 : -1;
                        } else {
                            return ascending ? -1 : 1;
                        }
                    });
                }
        }
    }
}