import { Injectable } from '@angular/core';
import { TrelloDataService } from './trello-data.service';
import { History } from 'src/app/shared/models/history/history.model';

/**
 * The badge color applied when a card's history has never been viewed
 */
export const BADGE_COLOR_UNSEEN = "#FF6600";

/**
 * The badge color applied when a card's history has changes that have been seen
 */
export const BADGE_COLOR_CHANGES = "#555555";

/**
 * The badge color applied when a card's history has been viewed, but contains unseen changes
 */
export const BADGE_COLOR_CHANGES_NEW = "#C0392B";

/**
 * The badge color applied when a card's history contains no changes
 */
export const BADGE_COLOR_CHANGES_NONE = "#1E8449";

/**
 * The badge color applied when the badge/icon could not be updated due to an error
 */
export const BADGE_COLOR_ERROR = "purple";

/**
 * The duration in milliseconds after a card's history has been opened that the badge should be refreshed (essentially "marking as read")
 */
export const BADGE_REFRESH_INTERVAL_MILLIS = 2000;

/**
 * The badge text applied when the badge/icon could not be updated due to an error
 */
export const BADGE_TEXT_ERROR = "?"

/**
 * The base URL of a Trello card
 */
export const BASE_OPEN_CARD_URL = "https://trello.com/c/";

/**
 * The REST URL template of a Trello card's history
 */
export const BASE_TRELLO_ACTIONS_API_URL = "https://trello.com/1/cards/{trelloCardId}/actions?filter=createCard,convertToCardFromCheckItem,updateCard&limit=1000";

/**
 * The default title/tooltip of the extension
 */
export const TITLE = "Trello Card History";

/**
 * The index at which a Trello card's ID is to be applied to BASE_OPEN_CARD_URL
 */
export const TRELLO_CARD_ID_BEGIN_IDX = BASE_OPEN_CARD_URL.length;

@Injectable({
  providedIn: 'root'
})

export class LegacyCoreService {
  isRunningInExtensionMode: boolean = chrome && chrome.extension && chrome.storage !== null;
  console: Console = console;
  storage: chrome.storage.LocalStorageArea = this.isRunningInExtensionMode ? chrome.storage.local : null;

  constructor() {
    if (this.isRunningInExtensionMode && chrome.extension) {
      const backgroundPage: Window = chrome.extension.getBackgroundPage();

      if (backgroundPage) {
        this.console = backgroundPage.console;
      }
    }
  }

  /**
   * Gets the active tab
   * @param {function(tab):void} callback - Function to invoke with the acquired tab data
   */
  getActiveTab(callback): void {
    chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
      // TODO: Establish a proper Tab class
      callback({ id: tabs[0].id, url: tabs[0].url });
    });
  }

  /**
  * Adds a listener to the browser's tabs' onUpdated event
  * @param {MediaQueryListListener} callback - Function to invoke when the tabs have been updated
  */
  addTabsUpdatedListener(listener): void {
    chrome.tabs.onUpdated.addListener(listener);
  }

  /**
  * Resets the extension's icon, badge, and enabled back to their default states
  * @param {number} tabId - The Id of the tab whose extension state should be reset
  */
  resetExtension(tabId?: number): void {
    chrome.browserAction.disable(tabId);
    chrome.browserAction.setBadgeText({ text: "", tabId: tabId });
    chrome.browserAction.setTitle({ title: TITLE });
  }

  getCurrentUrl(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
          resolve(null);
        }

        resolve(tabs[0].url);
      });
    });
  }

  getTrelloCardIdFromUrl(trelloCardUrl: string): string {
    if (!trelloCardUrl.startsWith(BASE_OPEN_CARD_URL)) {
      return null;
    }

    const endOfCardIdIdx = trelloCardUrl.indexOf('/', TRELLO_CARD_ID_BEGIN_IDX + 1);
    const trelloCardId = trelloCardUrl.substring(TRELLO_CARD_ID_BEGIN_IDX, endOfCardIdIdx);

    return trelloCardId;
  }

  getTrelloCardIdFromCurrentUrl(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.getCurrentUrl().then(url => {
        if (url) {
          resolve(this.getTrelloCardIdFromUrl(url));
        } else {
          resolve(null);
        }
      });
    });
  }

  updateBadgeForTab(tab: any, trelloDataService: TrelloDataService): Promise<any> {
    return new Promise((resolve, reject) => {
      if (tab) {
        const trelloCardId: string = this.getTrelloCardIdFromUrl(tab.url);

        if (trelloCardId) {
          chrome.browserAction.enable(tab.id);

          trelloDataService.getHistory(trelloCardId).subscribe(history => {
            trelloDataService.applyLastViewedToHistory(history, false).then(() => {
              this.updateBadge(tab.id, history);

              resolve();
            });
          }, err => {
            this.updateBadge(tab.id, null);

            reject();
          });
        } else {
          this.resetExtension(tab.id);

          resolve();
        }
      } else {
        this.resetExtension();

        resolve();
      }
    });
  }

  updateBadgeForCurrentTabByHistory(history: History): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getActiveTab((tab) => {
        this.updateBadge(tab.id, history);

        resolve();
      });
    });
  }

  updateBadge(tabId: number, history?: History): void {
    if (history !== null) {
      const totalUpdateCount = history.totalUpdateCount;

      let badgeColor = (totalUpdateCount > 0 ? BADGE_COLOR_CHANGES : BADGE_COLOR_CHANGES_NONE);
      let badgeText = totalUpdateCount.toString();
      let title = TITLE + " - " + totalUpdateCount.toString() + " total changes";

      if (!history.lastViewed && totalUpdateCount > 0) {
        badgeColor = BADGE_COLOR_UNSEEN;
        title = TITLE + " - never viewed";
      } else if (history.newHistoryItems) {
        badgeColor = BADGE_COLOR_CHANGES_NEW;
        badgeText = history.newHistoryItems.toString();
        title = TITLE + " - " + history.newHistoryItems + " NEW change(s)";
      }

      chrome.browserAction.setBadgeText({ text: badgeText, tabId: tabId });
      chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor, tabId: tabId });
      chrome.browserAction.setTitle({ title: title });
    } else {
      chrome.browserAction.setBadgeBackgroundColor({ color: BADGE_COLOR_ERROR, tabId: tabId });
      chrome.browserAction.setBadgeText({ text: BADGE_TEXT_ERROR, tabId: tabId });
    }
  }
}
