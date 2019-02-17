import { Component, OnInit, Input } from '@angular/core';
import { HistoryItem } from 'src/app/shared/models/history-item.model';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent implements OnInit {
  @Input() historyItem: HistoryItem;
  get updateVerb(): string {
    switch (this.historyItem.updateType) {
      case 'Created':
        return null;
      case 'Description':
      case 'Title':
        return 'changed';
      case 'Points':
      {
        if (!this.historyItem.sanitizedOldPoints) {
          return 'added';
        } else {
          return 'changed';
        }
      }
    }
  }

  constructor() { }

  ngOnInit() {
    
  }

}
