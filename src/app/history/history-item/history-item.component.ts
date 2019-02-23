import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { HistoryItem } from 'src/app/shared/models/history/history-item.model';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent {
  readonly MAX_VALUE_DISPLAY_LENGTH: number = 65;
  readonly VERB_ADDED: string = 'added';
  readonly VERB_CHANGED: string = 'changed';
  readonly VERB_CREATED: string = null;

  @Input() historyItem: HistoryItem;

  newValueCollapsed: boolean = true;
  oldValueCollapsed: boolean = true;

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

  constructor(private changeDetector: ChangeDetectorRef) {}

  toggleNewValueCollapse(): void {
    this.newValueCollapsed = !this.newValueCollapsed;

    this.changeDetector.detectChanges();
  }

  toggleOldValueCollapse(): void {
    this.oldValueCollapsed = !this.oldValueCollapsed;

    this.changeDetector.detectChanges();
  }

}
