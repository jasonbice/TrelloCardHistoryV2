import { Component, Input, ChangeDetectorRef, Output, EventEmitter, OnInit } from '@angular/core';
import { HistoryItem, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { PrettifyHistoryValuePipe } from 'src/app/shared/pipes/prettify-history-value.pipe';
import { HistoryItemFilter } from 'src/app/shared/models/history/history-item-filter.model';
import { ITrelloMemberCreator } from 'src/app/shared/models/trello/trello-member-creator.model';
import { History } from 'src/app/shared/models/history/history.model';
import { TrelloDataService } from 'src/app/services/trello-data.service';

@Component({
  selector: 'history-item',
  templateUrl: './history-item.component.html',
  styleUrls: ['./history-item.component.css']
})
export class HistoryItemComponent implements OnInit {

  readonly MAX_VALUE_DISPLAY_LENGTH: number = PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH;
  readonly TRUNCATE_APPEND = '...';
  readonly VERB_ADDED: string = 'added';
  readonly VERB_CHANGED: string = 'changed';
  readonly VERB_CONVERTED: string = null;
  readonly VERB_COPIED: string = null;
  readonly VERB_CREATED: string = null;
  readonly VERB_REMOVED: string = 'removed';

  @Output() filterByMemberCreatorIdToggled = new EventEmitter<string>();
  @Output() filterByUpdateTypeToggled = new EventEmitter<UpdateType>();
  @Input() allChangeAuthors: ITrelloMemberCreator[];
  @Input() history: History;
  @Input() historyItem: HistoryItem;
  @Input() currentHistoryItemFilter: HistoryItemFilter;

  isConfirmingApplyValueNew = false;
  isConfirmingApplyValueOld = false;
  showDiff = false;

  get isOnlyChangeAuthor(): boolean {
    return this.allChangeAuthors && this.allChangeAuthors.length === 1;
  }

  get memberIdFilterTitle(): string {
    if (this.isOnlyChangeAuthor) {
      return this.historyItem.trelloHistoryDataObj.memberCreator.fullName;
    } else if (this.isFilteredByThisMemberId) {
      return `Stop filtering by ${this.historyItem.trelloHistoryDataObj.memberCreator.fullName}'s changes`;
    } else {
      return `Filter by ${this.historyItem.trelloHistoryDataObj.memberCreator.fullName}'s changes`;
    }
  }

  get isFilteredByThisMemberId(): boolean {
    if (!this.currentHistoryItemFilter) {
      return false;
    }

    return this.currentHistoryItemFilter.memberCreatorIds.includes(this.historyItem.trelloHistoryDataObj.idMemberCreator);
  }

  get enableClipboardCopy(): boolean {
    return this.historyItem.updateType === UpdateType.Description || this.historyItem.updateType === UpdateType.Title;
  }

  newValueCollapsed = false;
  oldValueCollapsed = false;

  get updateVerb(): string {
    switch (this.historyItem.updateType) {
      case UpdateType.Converted:
        return this.VERB_CONVERTED;
      case UpdateType.Copied:
        return this.VERB_COPIED;
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

  get sourceTrelloCardLink(): string {
    if (this.historyItem.trelloHistoryDataObj.data.cardSource) {
      return this.trelloDataService.getTrelloCardUrl(this.historyItem.trelloHistoryDataObj.data.cardSource.shortLink);
    }

    return null;
  }

  constructor(private trelloDataService: TrelloDataService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onExpandToggled(null, true);
    this.onExpandToggled(null, false);
  }

  onExpandToggled(event: string, isNewValue: boolean): void {
    const val: string = isNewValue ? this.historyItem.newValue : this.historyItem.oldValue;

    if (val && val !== null && val.length > this.MAX_VALUE_DISPLAY_LENGTH) {
      if (isNewValue) {
        this.newValueCollapsed = !this.newValueCollapsed;
      } else {
        this.oldValueCollapsed = !this.oldValueCollapsed;
      }

      this.changeDetector.detectChanges();
    }
  }

  onConfirmingApplyValue(event: boolean, isNewValue: boolean): void {
    if (isNewValue) {
      this.isConfirmingApplyValueNew = event;
    } else {
      this.isConfirmingApplyValueOld = event;
    }

    this.changeDetector.detectChanges();
  }

  onFilterByMemberCreatorIdToggled(): void {
    if (!this.isOnlyChangeAuthor) {
      this.filterByMemberCreatorIdToggled.emit(this.historyItem.trelloHistoryDataObj.idMemberCreator);
    }
  }

  onFilterByUpdateTypeToggled(): void {
    this.filterByUpdateTypeToggled.emit(this.historyItem.updateType);
  }

  onShowDiffRequested(showDiff: boolean): void {
    this.showDiff = showDiff;

    this.changeDetector.detectChanges();
  }

}
