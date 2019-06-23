import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { ActivatedRoute } from '@angular/router';
import { HistoryItemFilter } from 'src/app/shared/models/history/history-item-filter.model';
import { HistoryItem, SortBy, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { ITrelloMemberCreator } from 'src/app/shared/models/trello/trello-member-creator.model';
import { Utils } from 'src/app/shared/utils';
import { CardUpdatedEventArgs } from 'src/app/shared/models/card-updated-event-args.model';
import { ToastrService } from 'ngx-toastr';
import { ExtensionHostService } from 'src/app/services/extension-host.service';
import { Observable } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';

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

  constructor(private extensionHostService: ExtensionHostService, private trelloDataService: TrelloDataService, private changeDetectorRef: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private toastrService: ToastrService) {
    this.sortBy = SortBy.Date;
    this.sortAscending = false;
  }

  ngOnInit() {
    if (this.extensionHostService.isRunningInExtensionMode) {
      this.trelloDataService.getTrelloCardIdFromCurrentUrl().subscribe(shortLink => {
        this.shortLink = shortLink;

        this.loadHistory().subscribe();
      });
    } else {
      this.shortLink = this.activatedRoute.snapshot.params['shortLink'];

      this.loadHistory().subscribe();
    }

    this.trelloDataService.cardUpdated.subscribe((cardUpdatedEventArgs: CardUpdatedEventArgs) => {
      this.onCardUpdated(cardUpdatedEventArgs);
    });
  }

  loadHistory(): Observable<void> {
    return this.trelloDataService.getHistory(this.shortLink, true).pipe(
      tap(h => {
        this.history = h;

        this.allChangeAuthors = Utils.getDistinctObjectArray(this.history.historyItems.map(h => {
          return h.trelloHistoryDataObj.memberCreator;
        }), 'id');

        this.applyHistoryItemFilterAndSort();
      }),
      flatMap(h => this.extensionHostService.updateBadgeForCurrentTabByHistory(this.history))
    );
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
    this.loadHistory().subscribe(() => {
      this.toastrService.success(`${cardUpdatedEventArgs.updateType} ${cardUpdatedEventArgs.updateType === UpdateType.Points ? 'have' : 'has'} been updated`);
    });
  }
}
