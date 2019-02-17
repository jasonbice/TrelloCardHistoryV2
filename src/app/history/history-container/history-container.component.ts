import { Component, OnInit } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history.model';

@Component({
  selector: 'app-history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.css']
})
export class HistoryContainerComponent implements OnInit {
  history: History;
  displayDescriptionChanges: boolean = true;
  displayTitleChanges: boolean = true;
  displayPointChanges: boolean = true;

  constructor(private trelloDataService: TrelloDataService) { }

  ngOnInit() {
    this.trelloDataService.getTrelloHistoryDataObjects('ZBlI1CfQ').subscribe(h => this.history = h);
  }
}
