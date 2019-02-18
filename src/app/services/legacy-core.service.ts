import { Injectable } from '@angular/core';
import deepcopy from 'deepcopy';
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
 * The maximium number of card data items the extension is permitted to keep in browser storage
 */
export const STORAGE_LIMIT_CARD_DATA_ITEMS = 1000;

/**
 * The default title/tooltip of the extension
 */
export const TITLE = "Trello Card History";

/**
 * The index at which a Trello card's ID is to be applied to BASE_OPEN_CARD_URL
 */
export const TRELLO_CARD_ID_BEGIN_IDX = BASE_OPEN_CARD_URL.length;

/**
 * Shortcut to the extension's background page/object
 */
export let background = chrome.extension.getBackgroundPage();

/**
 * Shortcut to an always-available storage object
 */
export let storage = chrome.storage.local;

@Injectable({
  providedIn: 'root'
})

export class LegacyCoreService {
  //console: Console = console;
  console: Console = chrome.extension.getBackgroundPage().console;

  constructor() { }

  /**
   * Gets the active tab
   * @param {function(tab):void} callback - Function to invoke with the acquired tab data
   */
  getActiveTab(callback): void {
    chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
      // TODO: Establish a proper Tab class
      callback({ id: tabs[0].id, url: tabs[0].url });
    });
  };

  /**
  * Adds a listener to the browser's tabs' onUpdated event
  * @param {MediaQueryListListener} callback - Function to invoke when the tabs have been updated
  */
  addTabsUpdatedListener(listener): void {
    chrome.tabs.onUpdated.addListener(listener);
  };

  /**
  * Resets the extension's icon, badge, and enabled back to their default states
  * @param {number} tabId - The Id of the tab whose extension state should be reset
  */
  resetExtension(tabId?: number): void {
    chrome.browserAction.disable(tabId);
    chrome.browserAction.setBadgeText({ text: "", tabId: tabId });
    chrome.browserAction.setTitle({ title: TITLE });
  };

  getCurrentUrl(callback): void {
    chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        callback(null);
      }

      callback(tabs[0].url);
    });
  }

  getTrelloCardIdFromUrl(trelloCardUrl: string): string {
    let endOfCardIdIdx = trelloCardUrl.indexOf('/', TRELLO_CARD_ID_BEGIN_IDX + 1);
    let trelloCardId = trelloCardUrl.substring(TRELLO_CARD_ID_BEGIN_IDX, endOfCardIdIdx);

    return trelloCardId;
  }

  getTrelloCardIdFromCurrentUrl(callback): void {
    this.getCurrentUrl((url: string) => {
      let shortLink: string = this.getTrelloCardIdFromUrl(url)

      callback(shortLink);
    });
  }

  /**
  * Refreshes the extension's icon for the active tab
  * @param {TrelloDataService} trelloService - Service providing interactions with the Trello API
  */
  refreshIcon(trelloDataService: TrelloDataService): void {
    let that = this;

    // TODO: Use core.getActiveTab(callback)
    chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        return;
      }

      let url: string = tabs[0].url;
      let trelloCardId: string = this.getTrelloCardIdFromUrl(url);
      let tabId: number = tabs[0].id;

      if (url.indexOf(BASE_OPEN_CARD_URL) === 0) {
        chrome.browserAction.enable(tabId);

        trelloDataService.getHistory(trelloCardId).subscribe(history => {
          that.applyCardResultToIcon(tabId, history);
        }, err => this.applyCardResultToIcon(tabId, null));
      } else {
        this.resetExtension(tabId);
      }
    });
  };

  applyCardResultToIcon(tabId: number, history?: History): void {
    // if (history != null) {
    //   chrome.browserAction.setBadgeText({ text: history.badgeText, tabId: tabId });
    //   chrome.browserAction.setBadgeBackgroundColor({ color: history.badgeColor, tabId: tabId });
    //   chrome.browserAction.setTitle({ title: history.title });
    // } else {
    //   chrome.browserAction.setBadgeBackgroundColor({ color: BADGE_COLOR_ERROR, tabId: tabId });
    //   chrome.browserAction.setBadgeText({ text: BADGE_TEXT_ERROR, tabId: tabId });
    // }
  };

  /**
    * Gets the card data from storage
    * @param {function(tab):void} callback - Function to invoke with the acquired tab data
    */
  getCardData(callback): void {
    storage.get("cardData", function (result) {
      if (!result.cardData) {
        result.cardData = [];
      }

      callback(result.cardData);
    });
  };

  /**
  * Saves the card data to storage
  * @param {function():void} callback - Function to invoke once the save has completed
  */
  saveCardData(cardData, callback): void {
    storage.set({ cardData: cardData }, callback);
  };

  /**
  * Purges storage of the minimum number of ("old") items necessary to remain under STORAGE_LIMIT_CARD_DATA_ITEMS
  */
  cleanUpStorage(): void {
    this.getCardData(function (cardData) {
      if (cardData.length === 0) {
        return;
      }

      let cardDataStorageInfo = {
        cardDataItems: cardData.length,
        itemLimit: STORAGE_LIMIT_CARD_DATA_ITEMS,
        cardDataStorageBytes: JSON.stringify(cardData).length,
        averageCardDataItemSizeBytes: null,
        itemsToCleanUp: null,
        cleanUpStartIndex: null
      };

      cardDataStorageInfo.averageCardDataItemSizeBytes = cardDataStorageInfo.cardDataStorageBytes / cardData.length;
      cardDataStorageInfo.itemsToCleanUp = Math.max(cardData.length - STORAGE_LIMIT_CARD_DATA_ITEMS, 0);
      cardDataStorageInfo.cleanUpStartIndex = deepcopy(cardData.length - cardDataStorageInfo.itemsToCleanUp - 1);

      if (cardDataStorageInfo.itemsToCleanUp) {
        cardData.sort((a, b) => new Date(a.lastViewed).valueOf() - new Date(b.lastViewed).valueOf());
        cardData.splice(cardDataStorageInfo.cleanUpStartIndex, cardDataStorageInfo.itemsToCleanUp);

        this.saveCardData(cardData, null);

        this.console.debug("Cleaned up " + cardDataStorageInfo.itemsToCleanUp + " cardData items");
      }
    });
  };

  /**
  * Performs a wholesale reset of the extension's storage
  */
  clearStorage(): void {
    chrome.storage.local.clear();
  };
}