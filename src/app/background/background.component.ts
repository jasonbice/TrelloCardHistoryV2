import { Component, OnInit } from '@angular/core';
import { LegacyCoreService } from '../services/legacy-core.service';
import { TrelloDataService } from '../services/trello-data.service';

@Component({
  templateUrl: './background.component.html'
})
export class BackgroundComponent implements OnInit {

  constructor(private coreService: LegacyCoreService, private trelloDataService: TrelloDataService) { }

  ngOnInit() {
    console.log("Background running");

    //this.coreService.resetExtension(null);
    //this.coreService.cleanUpStorage();

    // this.coreService.addTabsUpdatedListener((tabId, changeInfo, tab) => {
    //   if (changeInfo.status === 'complete') {
    //     this.coreService.refreshIcon(this.trelloDataService);
    //   }
    // });
  }

}