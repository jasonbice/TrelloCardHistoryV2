import { Component, OnInit, Input } from '@angular/core';
import { HistoryItem } from 'src/app/shared/models/history-item.model';

@Component({
  selector: 'history-item-list',
  templateUrl: './history-item-list.component.html',
  styleUrls: ['./history-item-list.component.css']
})
export class HistoryItemListComponent implements OnInit {
  @Input() historyItems: HistoryItem[];
  
  constructor() { }

  ngOnInit() {
    console.log("History Items", this.historyItems);
  }

}