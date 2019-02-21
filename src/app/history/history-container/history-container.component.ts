import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { ActivatedRoute } from '@angular/router';
import { HistoryItemFilter } from 'src/app/shared/models/history/history-item-filter.model';
import { HistoryItem, SortBy } from 'src/app/shared/models/history/history-item.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.css']
})
export class HistoryContainerComponent implements OnInit {
  history: History;
  filteredHistoryItems: HistoryItem[];
  historyItemFilter: HistoryItemFilter = new HistoryItemFilter();

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService, private changeDetector: ChangeDetectorRef, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.coreService.isRunningInExtensionMode) {
      this.coreService.getTrelloCardIdFromCurrentUrl((shortLink: string) => {
        this.loadHistory(shortLink);
      });
    } else {
      let shortLink = this.activatedRoute.snapshot.params['shortLink'];

      this.loadHistory(shortLink);
    }
  }

  loadHistory(shortLink: string): void {
    this.trelloDataService.getHistory(shortLink).subscribe(history => {
      this.history = history;

      this.trelloDataService.applyLastViewedToHistory(this.history, true, () => {
        this.applyHistoryItemFilterAndSort();
      });
    });
  }

  applyHistoryItemFilterAndSort(): void {
    this.filteredHistoryItems = this.historyItemFilter.filter(this.history.historyItems);
    HistoryItem.sort(this.filteredHistoryItems, SortBy.Date, false);

    this.changeDetector.detectChanges();
  }
}
