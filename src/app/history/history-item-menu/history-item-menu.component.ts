import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { History } from 'src/app/shared/models/history/history.model';
import { HistoryItem, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { PrettifyHistoryValuePipe } from 'src/app/shared/pipes/prettify-history-value.pipe';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CardUpdatedEventArgs } from 'src/app/shared/models/card-updated-event-args.model';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'history-item-menu',
  templateUrl: './history-item-menu.component.html',
  styleUrls: ['./history-item-menu.component.css']
})
export class HistoryItemMenuComponent implements OnInit {
  @Output() expandToggled = new EventEmitter<string>();
  @Output() confirmingApplyValue = new EventEmitter<boolean>();
  @Output() showDiffRequested = new EventEmitter<boolean>();

  @Input() history: History;
  @Input() historyItem: HistoryItem;
  @Input() isNewValue: boolean;
  @Input() isCollapsed: boolean;

  subjectValue: string;
  subjectValueRaw: string;
  enableToggleExpandButton: boolean;
  enableCopyButton: boolean;
  enableApplyValueButton: boolean;
  enableDiffButton: boolean;
  displayApplyValueMenu: boolean = false;
  displayMenu: boolean;

  constructor(private trelloDataService: TrelloDataService, private toastrService: ToastrService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subjectValue = this.isNewValue ? this.historyItem.newValue : this.historyItem.oldValue;
    this.subjectValueRaw = this.isNewValue ? this.historyItem.newValueRaw : this.historyItem.oldValueRaw;

    this.enableToggleExpandButton = this.subjectValue && this.subjectValue.length > PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH;
    this.enableCopyButton = this.subjectValue && (this.historyItem.updateType === UpdateType.Description || this.historyItem.updateType === UpdateType.Points || this.historyItem.updateType === UpdateType.Title);

    this.enableApplyValueButton =
      (this.historyItem.updateType === UpdateType.Description && this.subjectValueRaw !== this.history.description) ||
      (this.historyItem.updateType === UpdateType.Points && +this.subjectValueRaw !== this.history.points) ||
      (this.historyItem.updateType === UpdateType.Title && this.subjectValue !== Utils.getSanitizedTitle(this.history.title));

    this.enableDiffButton = (this.historyItem.updateType === UpdateType.Description || this.historyItem.updateType === UpdateType.Title) &&
      !Utils.isNullOrWhiteSpace(this.historyItem.newValue) &&
      !Utils.isNullOrWhiteSpace(this.historyItem.oldValue);

    this.displayMenu = this.enableToggleExpandButton || this.enableCopyButton || this.enableApplyValueButton;
  }

  toggleExpand(): void {
    this.expandToggled.emit(null);
  }

  applyValue(): void {
    this.displayApplyValueMenu = !this.displayApplyValueMenu;
    this.confirmingApplyValue.emit(true);

    // HACK: Determine why this is needed only after an applyValueConfirm() -> reload
    // Commented for now: this is a symptom of a larger/wider issue; disabling makes this easier to t/s
    this.changeDetector.detectChanges();
  }

  applyValueConfirm(confirm: boolean): void {
    if (confirm) {
      this.trelloDataService.updateCard(this.history, this.historyItem.trelloHistoryDataObj.data.card.id, this.historyItem.updateType, this.subjectValueRaw)
        .pipe(
          catchError((error) => {
            this.toastrService.error(error);

            return throwError(error);
          }))
        .subscribe(() => {
          const cardUpdatedEventArgs = new CardUpdatedEventArgs(this.historyItem.updateType, this.subjectValueRaw);

          this.trelloDataService.cardUpdated.emit(cardUpdatedEventArgs);
        });
    }

    this.displayApplyValueMenu = false;
    this.confirmingApplyValue.emit(false);
  }

  showDiff(): void {
    this.showDiffRequested.emit(true);
  }

  /**
   * Copies the supplied value to the clipboard
   * @param value The value to be copied
   * @see https://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension
   */
  copyValueToClipboard(): void {
    //Create a textbox field where we can insert text to. 
    const copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = this.subjectValueRaw;

    //Append the textbox field into the body as a child. 
    //"execCommand()" only works when there exists selected text, and the text is inside 
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur(). 
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor 
    //other elements can get access to this.
    document.body.removeChild(copyFrom);

    this.toastrService.success(`${this.isNewValue ? 'New' : 'Old'} ${this.historyItem.updateType} copied`);
  }

}
