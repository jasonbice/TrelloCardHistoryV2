import { ITrelloHistoryDataObj } from '../trello/trello-history-data-obj.model';
import { TrelloDataService } from 'src/app/services/trello-data.service';

export enum UpdateType {
    Converted = 'Converted',
    Copied = 'Copied',
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
            case UpdateType.Converted: return null;
            case UpdateType.Created: return null;
            case UpdateType.Description: return this.sanitizedOldDescription;
            case UpdateType.Points: return String(this.sanitizedOldPoints ? this.sanitizedOldPoints + ' points' : '');
            case UpdateType.Title: return this.sanitizedOldTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    get newValue(): string {
        switch (this.updateType) {
            case UpdateType.Converted: return null;
            case UpdateType.Created: return null;
            case UpdateType.Description: return this.sanitizedNewDescription;
            case UpdateType.Points: return String(this.sanitizedNewPoints ? this.sanitizedNewPoints + ' points' : '');
            case UpdateType.Title: return this.sanitizedNewTitle;
            default: throw new Error(`${this.updateType} not implemented`);
        }
    }

    get updateType(): UpdateType {
        if (!this.trelloHistoryDataObj) {
            return null;
        }

        if (this.trelloHistoryDataObj.type === 'convertToCardFromCheckItem') {
            return UpdateType.Converted;
        } else if (this.trelloHistoryDataObj.type === 'copyCard') {
            return UpdateType.Copied;
        } else if (this.trelloHistoryDataObj.type === 'createCard') {
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
        this.initialize();
    }

    initialize(): void {
        this.sanitizedNewPoints = TrelloDataService.getSanitizedPoints(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewTitle = TrelloDataService.getSanitizedTitle(this.trelloHistoryDataObj.data.card.name);
        this.sanitizedNewDescription = TrelloDataService.getSanitizedDescription(this.trelloHistoryDataObj.data.card.desc);

        if (this.trelloHistoryDataObj.data.old) {
            this.sanitizedOldPoints = TrelloDataService.getSanitizedPoints(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldTitle = TrelloDataService.getSanitizedTitle(this.trelloHistoryDataObj.data.old.name);
            this.sanitizedOldDescription = TrelloDataService.getSanitizedDescription(this.trelloHistoryDataObj.data.old.desc);
        }

        this.trelloHistoryDataObj.date = new Date(this.trelloHistoryDataObj.date);
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