import { HistoryItem, UpdateType } from './history-item.model';

export class HistoryItemFilter {
    filterBy: string;
    includeDescriptionChanges: boolean = true;
    includePointsChanges: boolean = true;
    includeTitleChanges: boolean = true;
    memberCreatorIds: string[] = [];

    filter(historyItems: HistoryItem[]): HistoryItem[] {
        let filterByString: string = this.filterBy ? this.filterBy.toLowerCase() : null;

        let filteredHistoryItems: HistoryItem[] = historyItems.filter(historyItem => {
            return (this.includeDescriptionChanges || historyItem.updateType !== UpdateType.Description) &&
                (this.includePointsChanges || historyItem.updateType !== UpdateType.Points) &&
                (this.includeTitleChanges || historyItem.updateType !== UpdateType.Title) &&
                (!this.memberCreatorIds || this.memberCreatorIds.length === 0 || this.memberCreatorIds.indexOf(historyItem.trelloHistoryDataObj.memberCreator.id) > -1) &&
                (!filterByString ||
                    (historyItem.updateType === UpdateType.Title && historyItem.sanitizedNewTitle && historyItem.sanitizedNewTitle.toLowerCase().indexOf(filterByString) > -1) ||
                    (historyItem.updateType === UpdateType.Title && historyItem.sanitizedOldTitle && historyItem.sanitizedOldTitle.toLowerCase().indexOf(filterByString) > -1) ||
                    (historyItem.updateType === UpdateType.Description && historyItem.sanitizedNewDescription && historyItem.sanitizedNewDescription.toLowerCase().indexOf(filterByString) > -1) ||
                    (historyItem.updateType === UpdateType.Description && historyItem.sanitizedOldDescription && historyItem.sanitizedOldDescription.toLowerCase().indexOf(filterByString) > -1) ||
                    (historyItem.trelloHistoryDataObj.memberCreator && historyItem.trelloHistoryDataObj.memberCreator.fullName && historyItem.trelloHistoryDataObj.memberCreator.fullName.toLowerCase().indexOf(filterByString) > -1) ||
                    (historyItem.trelloHistoryDataObj.memberCreator && historyItem.trelloHistoryDataObj.memberCreator.initials && historyItem.trelloHistoryDataObj.memberCreator.initials.toLowerCase().indexOf(filterByString) > -1))
        });

        return filteredHistoryItems;
    }

    toggleMemberCreatorId(memberCreatorId: string): void {
        const memberCreatorIdIndex = this.memberCreatorIds.indexOf(memberCreatorId);

        if (memberCreatorIdIndex > -1) {
            this.memberCreatorIds.splice(memberCreatorIdIndex, 1);
        } else {
            this.memberCreatorIds.push(memberCreatorId);
        }
    }
}