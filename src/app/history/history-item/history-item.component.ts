import { Component, OnInit, Input } from '@angular/core';
import { HistoryItem } from 'src/app/shared/models/history-item.model';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent implements OnInit {
  @Input() historyItem: HistoryItem;

  readonly VERB_ADDED: string = 'added';
  readonly VERB_CHANGED: string = 'changed';
  readonly VERB_CREATED: string = null;

  get updateVerb(): string {
    switch (this.historyItem.updateType) {
      case 'Created':
        return this.VERB_CREATED;
      case 'Description':
      {
        if (!this.historyItem.sanitizedOldDescription) {
          return this.VERB_ADDED;
        } else {
          return this.VERB_CHANGED;
        }
      }
      case 'Title':
        return this.VERB_CHANGED;
      case 'Points':
      {
        if (!this.historyItem.sanitizedOldPoints) {
          return this.VERB_ADDED;
        } else {
          return this.VERB_CHANGED;
        }
      }
    }
  }

  constructor() { }

  ngOnInit() {
    
  }

}