import { Component, OnInit } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { ITrelloHistoryDataObj } from 'src/app/shared/models/trello/trello-history-data-obj.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.css']
})
export class HistoryContainerComponent implements OnInit {
  displayDescriptionChanges: boolean = true;
  displayTitleChanges: boolean = true;
  displayPointChanges: boolean = true;

  constructor(private trelloDataService: TrelloDataService) { }

  ngOnInit() {
    this.trelloDataService.getTrelloHistoryDataObjects('ZBlI1CfQ').subscribe(r => console.log("r", r));
  }

}
