import { Component, OnInit } from '@angular/core';
import { TrelloDataService } from '../services/trello-data.service';
import { ExtensionHostService } from '../services/extension-host.service';

@Component({
  templateUrl: './background.component.html'
})
export class BackgroundComponent implements OnInit {

  constructor(private extensionHostService: ExtensionHostService, private trelloDataService: TrelloDataService) { }

  ngOnInit() {
    console.debug(`Tello Card History background component intialized and running in ${this.extensionHostService.isRunningInExtensionMode ? 'EXTENSION' : 'BROWSER'} mode`);

    if (this.extensionHostService.isRunningInExtensionMode) {
      this.extensionHostService.resetExtension(null);
      this.trelloDataService.cleanUpLocalStorage().subscribe();

      this.extensionHostService.addTabsUpdatedListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
          this.extensionHostService.updateBadgeForTab(tab, this.trelloDataService).subscribe();
        }
      });
    }
  }

}
