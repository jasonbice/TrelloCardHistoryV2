import { HistoryItem, UpdateType } from './history-item.model';

export class HistoryItemFilter {
    filterBy: string;
    updateTypes: UpdateType[] = [];
    memberCreatorIds: string[] = [];

    filter(historyItems: HistoryItem[]): HistoryItem[] {
        const filterByString: string = this.filterBy ? this.filterBy.toLowerCase() : null;

        const filteredHistoryItems: HistoryItem[] = historyItems.filter(historyItem => {
            return (!this.updateTypes || this.updateTypes.length === 0 || this.updateTypes.indexOf(historyItem.updateType) > -1) &&
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

    toggleUpdateType(updateType: UpdateType) {
        const updateTypeIndex = this.updateTypes.indexOf(updateType);

        if (updateTypeIndex > -1) {
            this.updateTypes.splice(updateTypeIndex, 1);
        } else {
            this.updateTypes.push(updateType);
        }
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