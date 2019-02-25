import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { HistoryItem, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { PrettifyHistoryValuePipe } from 'src/app/shared/pipes/prettify-history-value.pipe';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent {
  readonly MAX_VALUE_DISPLAY_LENGTH: number = PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH
  readonly TRUNCATE_APPEND = '...';
  readonly VERB_ADDED: string = 'added';
  readonly VERB_CHANGED: string = 'changed';
  readonly VERB_CREATED: string = null;
  readonly VERB_REMOVED: string = 'removed';

  @Input() historyItem: HistoryItem;

  newValueCollapsed: boolean = true;
  oldValueCollapsed: boolean = true;

  get updateVerb(): string {
    switch (this.historyItem.updateType) {
      case UpdateType.Created:
        return this.VERB_CREATED;
      case UpdateType.Description:
      {
        if (!this.historyItem.sanitizedOldDescription) {
          return this.VERB_ADDED;
        } else if (this.historyItem.sanitizedOldDescription && !this.historyItem.sanitizedNewDescription) {
          return this.VERB_REMOVED;
        } else {
          return this.VERB_CHANGED;
        }
      }
      case UpdateType.Title:
        return this.VERB_CHANGED;
      case UpdateType.Points:
      {
        if (!this.historyItem.sanitizedOldPoints) {
          return this.VERB_ADDED;
        } else if (this.historyItem.sanitizedOldPoints && !this.historyItem.sanitizedNewPoints) {
          return this.VERB_REMOVED;
        } else {
          return this.VERB_CHANGED;
        }
      }
      default:
        throw new Error(`Unexpected updateType: ${this.historyItem.updateType}`);
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
