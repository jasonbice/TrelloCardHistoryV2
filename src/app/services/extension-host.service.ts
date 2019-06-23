import { Injectable } from '@angular/core';
import { Observable, of, bindCallback } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { History } from 'src/app/shared/models/history/history.model';
import { TrelloDataService } from './trello-data.service';
import { Tab } from '../shared/models/extension-host/tab.model';

@Injectable({
  providedIn: 'root'
})
export class ExtensionHostService {
  /**
  * The badge color applied when a card's history has never been viewed
  */
  static readonly BADGE_COLOR_UNSEEN = "#FF6600";

  /**
   * The badge color applied when a card's history has changes that have been seen
   */
  static readonly BADGE_COLOR_CHANGES = "#555555";

  /**
   * The badge color applied when a card's history has been viewed, but contains unseen changes
   */
  static readonly BADGE_COLOR_CHANGES_NEW = "#C0392B";

  /**
   * The badge color applied when a card's history contains no changes
   */
  static readonly BADGE_COLOR_CHANGES_NONE = "#1E8449";

  /**
   * The badge color applied when the badge/icon could not be updated due to an error
   */
  static readonly BADGE_COLOR_ERROR = "purple";

  /**
   * The duration in milliseconds after a card's history has been opened that the badge should be refreshed (essentially "marking as read")
   */
  static readonly BADGE_REFRESH_INTERVAL_MILLIS = 2000;

  /**
   * The badge text applied when the badge/icon could not be updated due to an error
   */
  static readonly BADGE_TEXT_ERROR = "?";

  /**
   * The default title/tooltip of the extension
   */
  static readonly TITLE = "Trello Card History";

  isRunningInExtensionMode: boolean;

  get console(): Console {
    if (chrome && chrome.extension) {
      return chrome.extension.getBackgroundPage().console;
    }

    return console;
  }

  constructor(private router: Router) {
    this.isRunningInExtensionMode = chrome != null && chrome.extension != null;
  }

  getActiveTab(): Observable<Tab> {
    const tabsQueryObs = bindCallback(chrome.tabs.query);

    const res = tabsQueryObs({ "active": true, "lastFocusedWindow": true }).pipe(
      map(tabs => tabs && tabs.length > 0 ? tabs[0] as Tab : null)
    );

    return res;
  }

  getCurrentUrl(): Observable<string> {
    if (this.isRunningInExtensionMode) {
      return this.getActiveTab().pipe(
        map(t => t.url)
      );
    } else {
      return of(this.router.url);
    }
  }

  /**
  * Adds a listener to the browser's tabs' onUpdated event
  * @param {MediaQueryListListener} callback - Function to invoke when the tabs have been updated
  */
  addTabsUpdatedListener(listener): void {
    if (this.isRunningInExtensionMode) {
      chrome.tabs.onUpdated.addListener(listener);
    }
  }

  /**
  * Resets the extension's icon, badge, and enabled back to their default states
  * @param {number} tabId - The Id of the tab whose extension state should be reset
  */
  resetExtension(tabId?: number): void {
    if (this.isRunningInExtensionMode) {
      chrome.browserAction.disable(tabId);
      chrome.browserAction.setBadgeText({ text: "", tabId: tabId });
      chrome.browserAction.setTitle({ title: ExtensionHostService.TITLE });
    }
  }

  updateBadgeForTab(tab: Tab, trelloDataService: TrelloDataService): Observable<History> {
    if (!this.isRunningInExtensionMode) {
      return of();
    }

    if (tab && tab.id) {
      const trelloCardId: string = trelloDataService.getTrelloCardIdFromUrl(tab.url);

      if (trelloCardId) {
        chrome.browserAction.enable(tab.id);

        return trelloDataService.getHistory(trelloCardId).pipe(
          tap(h => this.updateBadge(tab.id, h))
        );
      } else {
        this.resetExtension(tab.id);
      }
    } else {
      this.resetExtension(tab.id);
    }

    return of();
  }

  updateBadge(tabId: number, history?: History): void {
    if (history !== null) {
      const totalUpdateCount = history.totalUpdateCount;

      let badgeColor = (totalUpdateCount > 0 ? ExtensionHostService.BADGE_COLOR_CHANGES : ExtensionHostService.BADGE_COLOR_CHANGES_NONE);
      let badgeText = totalUpdateCount.toString();
      let title = `${ExtensionHostService.TITLE} - ${totalUpdateCount.toString()} total changes`;

      if (!history.lastViewed && totalUpdateCount > 0) {
        badgeColor = ExtensionHostService.BADGE_COLOR_UNSEEN;
        title = `${ExtensionHostService.TITLE} - never viewed`;
      } else if (history.newHistoryItems) {
        badgeColor = ExtensionHostService.BADGE_COLOR_CHANGES_NEW;
        badgeText = history.newHistoryItems.toString();
        title = `${ExtensionHostService.TITLE} - ${history.newHistoryItems} NEW change${history.newHistoryItems !== 1 ? 's' : ''}`;
      }

      chrome.browserAction.setBadgeText({ text: badgeText, tabId: tabId });
      chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor, tabId: tabId });
      chrome.browserAction.setTitle({ title: title });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({ color: ExtensionHostService.BADGE_COLOR_ERROR, tabId: tabId });
      chrome.browserAction.setBadgeText({ text: ExtensionHostService.BADGE_TEXT_ERROR, tabId: tabId });
    }
  }

  updateBadgeForCurrentTabByHistory(history: History): Observable<void> {
    return this.getActiveTab().pipe(
      tap((t: Tab) => {
        this.updateBadge(t.id, history);
      }),
      map(t => { })
    );
  }
}
