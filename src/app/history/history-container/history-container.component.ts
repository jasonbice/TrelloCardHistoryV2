import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history-container',
  templateUrl: './history-container.component.html',
  styleUrls: ['./history-container.component.css']
})
export class HistoryContainerComponent implements OnInit {
  shortLink: string;
  history: History;
  displayDescriptionChanges: boolean = true;
  displayTitleChanges: boolean = true;
  displayPointChanges: boolean = true;

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService, private changeDetector: ChangeDetectorRef, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.coreService.isRunningInExtensionMode) {
      this.coreService.getTrelloCardIdFromCurrentUrl((shortLink: string) => {
        this.trelloDataService.getHistory(shortLink).subscribe(history => {
          this.history = history;
          
          this.trelloDataService.applyLastViewedToHistory(this.history, true, () => {
            this.changeDetector.detectChanges();
          });
        });
      });
    } else {
      this.shortLink = this.activatedRoute.snapshot.params['shortLink'];
      
      this.trelloDataService.getHistory(this.shortLink).subscribe(history => {
        this.history = history;
        
        this.trelloDataService.applyLastViewedToHistory(this.history, true, () => {
          this.changeDetector.detectChanges();
        });
      });
    }
  }
}
