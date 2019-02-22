import { Component, OnInit } from '@angular/core';
import { LegacyCoreService } from '../services/legacy-core.service';
import { TrelloDataService } from '../services/trello-data.service';

@Component({
  templateUrl: './background.component.html'
})
export class BackgroundComponent implements OnInit {

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService) { }

  ngOnInit() {
    console.log(`Tello Card History background component intialized and running in ${this.coreService.isRunningInExtensionMode ? 'EXTENSION' : 'BROWSER'} mode`);

    if (this.coreService.isRunningInExtensionMode) {
      this.coreService.resetExtension(null);
      this.coreService.cleanUpStorage();

      this.coreService.addTabsUpdatedListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
          this.coreService.refreshIcon(this.trelloDataService);
        }
      });
    }
  }

}
