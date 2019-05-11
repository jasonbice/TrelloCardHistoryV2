import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HistoryItem, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { PrettifyHistoryValuePipe } from 'src/app/shared/pipes/prettify-history-value.pipe';

@Component({
  selector: 'history-item-menu',
  templateUrl: './history-item-menu.component.html',
  styleUrls: ['./history-item-menu.component.css']
})
export class HistoryItemMenuComponent implements OnInit {
  @Output() expandToggled = new EventEmitter<string>();
  @Input() historyItem: HistoryItem;
  @Input() isNewValue: boolean;
  @Input() isCollapsed: boolean;

  subjectValue: string;
  displayToggleExpandButton: boolean;
  displayCopyButton: boolean;
  displayMenu: boolean;

  constructor() { }

  ngOnInit(): void {
    this.subjectValue = this.isNewValue ? this.historyItem.newValue : this.historyItem.oldValue;

    this.displayToggleExpandButton = this.subjectValue && this.subjectValue.length > PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH;
    this.displayCopyButton = this.subjectValue && (this.historyItem.updateType === UpdateType.Description || this.historyItem.updateType === UpdateType.Title);
    this.displayMenu = this.displayToggleExpandButton || this.displayCopyButton;
  }

  toggleExpand(): void {
    this.expandToggled.emit(null);
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
    copyFrom.textContent = this.subjectValue;

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
  }

}
