import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryItemFilter } from 'src/app/shared/models/history/history-item-filter.model';
import { HistoryItem, SortBy } from 'src/app/shared/models/history/history-item.model';

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

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService, private changeDetector: ChangeDetectorRef, private activatedRoute: ActivatedRoute) { }

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
    HistoryItem.sort(this.filteredHistoryItems, SortBy.Date, false);

    this.changeDetector.detectChanges();
  }
}
