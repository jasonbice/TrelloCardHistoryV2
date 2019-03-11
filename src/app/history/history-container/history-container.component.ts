import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryItemFilter } from 'src/app/shared/models/history/history-item-filter.model';
import { HistoryItem, SortBy, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { ITrelloMemberCreator } from 'src/app/shared/models/trello/trello-member-creator.model';
import { getDistinctObjectArray } from 'src/app/shared/utils';

@Component({
  selector: 'app-history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.css']
})
export class HistoryContainerComponent implements OnInit {
  shortLink: string;
  history: History;
  filteredHistoryItems: HistoryItem[];
  historyItemFilter: HistoryItemFilter = new HistoryItemFilter();
  sortBy: SortBy;
  sortAscending: boolean;
  changeAuthors: ITrelloMemberCreator[];

  get containsDescriptionChanges(): boolean {
    return this.history.containsChangesOfType(UpdateType.Description);
  }

  get containsTitleChanges(): boolean {
    return this.history.containsChangesOfType(UpdateType.Title);
  }
  
  get containsPointsChanges(): boolean {
    return this.history.containsChangesOfType(UpdateType.Points);
  }

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService, private changeDetector: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    this.sortBy = SortBy.Date;
    this.sortAscending = false;
  }

  ngOnInit() {
    if (this.coreService.isRunningInExtensionMode) {
      this.coreService.getTrelloCardIdFromCurrentUrl().then(shortLink => {
        this.shortLink = shortLink;

        this.loadHistory();
      });
    } else {
      this.shortLink = this.activatedRoute.snapshot.params['shortLink'];

      this.loadHistory();
    }
  }

  loadHistory(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.trelloDataService.getHistory(this.shortLink).subscribe(history => {
        this.history = history;

        this.changeAuthors = getDistinctObjectArray(this.history.historyItems.map(h => {
          return h.trelloHistoryDataObj.memberCreator;
        }), 'id');

        this.applyHistoryItemFilterAndSort();

        this.trelloDataService.applyLastViewedToHistory(this.history, true).then(() => {
          this.coreService.updateBadgeForCurrentTabByHistory(this.history);

          resolve();
        }).catch(err => (reject(err)));
      });
    });
  }

  applyHistoryItemFilterAndSort(): void {
    this.filteredHistoryItems = this.historyItemFilter.filter(this.history.historyItems);
    HistoryItem.sort(this.filteredHistoryItems, this.sortBy, this.sortAscending);

    this.changeDetector.detectChanges();
  }

  clearChangeAuthorSelections(): void {
    this.historyItemFilter.memberCreatorIds.splice(0);

    this.applyHistoryItemFilterAndSort();
  }

  // toggleChangeAuthorSelection(id: string): void {
  //   const index: number = this.historyItemFilter.memberCreatorIds.indexOf(id);

  //   if (index > -1) {
  //     this.historyItemFilter.memberCreatorIds.splice(index, 1);
  //   } else {
  //     this.historyItemFilter.memberCreatorIds.push(id);
  //   }

  //   this.applyHistoryItemFilterAndSort();
  // }

  onFilterByMemberCreatorIdToggled(memberCreatorId: string) {
    this.historyItemFilter.toggleMemberCreatorId(memberCreatorId);   
    
    this.applyHistoryItemFilterAndSort();
  }
}
