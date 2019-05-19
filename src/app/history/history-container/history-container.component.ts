import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryItemFilter } from 'src/app/shared/models/history/history-item-filter.model';
import { HistoryItem, SortBy, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { ITrelloMemberCreator } from 'src/app/shared/models/trello/trello-member-creator.model';
import { Utils } from 'src/app/shared/utils';
import { CardUpdatedEventArgs } from 'src/app/shared/models/card-updated-event-args.model';
import { ToastrService } from 'ngx-toastr';

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
  allChangeAuthors: ITrelloMemberCreator[];

  get containsDescriptionChanges(): boolean {
    return this.history.containsChangesOfType(UpdateType.Description);
  }

  get containsTitleChanges(): boolean {
    return this.history.containsChangesOfType(UpdateType.Title);
  }

  get containsPointsChanges(): boolean {
    return this.history.containsChangesOfType(UpdateType.Points);
  }

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService, private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private toastrService: ToastrService) {
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

    this.trelloDataService.cardUpdated.subscribe((cardUpdatedEventArgs: CardUpdatedEventArgs) => {
      this.onCardUpdated(cardUpdatedEventArgs);
    });
  }

  loadHistory(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.trelloDataService.getHistory(this.shortLink).subscribe(history => {
        this.history = history;

        this.allChangeAuthors = Utils.getDistinctObjectArray(this.history.historyItems.map(h => {
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

    this.changeDetectorRef.detectChanges();
  }

  clearChangeAuthorSelections(): void {
    this.historyItemFilter.memberCreatorIds.splice(0);

    this.applyHistoryItemFilterAndSort();
  }

  onFilterByMemberCreatorIdToggled(memberCreatorId: string) {
    this.historyItemFilter.toggleMemberCreatorId(memberCreatorId);

    this.applyHistoryItemFilterAndSort();
  }

  onCardUpdated(cardUpdatedEventArgs: CardUpdatedEventArgs) {
    this.loadHistory().then(() => {
      this.toastrService.success(`${cardUpdatedEventArgs.updateType} ${cardUpdatedEventArgs.updateType === UpdateType.Points ? 'have' : 'has'} been updated`);
    });
  }
}
