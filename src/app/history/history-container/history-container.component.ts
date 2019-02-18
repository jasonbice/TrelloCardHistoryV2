import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';

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

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.coreService.getTrelloCardIdFromCurrentUrl((shortLink: string) => {
      this.trelloDataService.getHistory(shortLink).subscribe(history => {
        this.history = history;
        this.changeDetector.detectChanges();
      });
    });
  }
}
