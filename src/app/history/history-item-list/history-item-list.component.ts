import { Component, OnInit, Input } from '@angular/core';
import { HistoryItem } from 'src/app/shared/models/history/history-item.model';

@Component({
  selector: 'history-item-list',
  templateUrl: './history-item-list.component.html',
  styleUrls: ['./history-item-list.component.css']
})
export class HistoryItemListComponent implements OnInit {
  @Input() historyItems: HistoryItem[];

  constructor() { }

  ngOnInit() {
    this.sortHistoryItems(SortBy.Date, false);
  }

  sortHistoryItems(sortBy: SortBy, ascending: boolean): void {
    switch (sortBy) {
      case SortBy.Date:
      {
        this.historyItems.sort((a, b) => {
          if (a.trelloHistoryDataObj.date > b.trelloHistoryDataObj.date) {
            return ascending ? 1 : -1;
          } else {
            return ascending? -1 : 1;
          }

          return 0;
        });
      }
    }
  }
}

export enum SortBy
{
  Date
}