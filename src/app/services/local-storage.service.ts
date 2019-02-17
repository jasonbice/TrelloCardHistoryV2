import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getCardData(): any {
    
  }

  saveCardData(): void {
    
  }

  /**
   * Purges local storage of the minimum number of ("old") items necessary to remain under the item limit.
   * 
   * @param itemLimit The maximinum number of items permitted in storage.
   */
  truncateStorage(itemLimit: number): void {

  }

  /**
   * Performes a wholesale reset of the extension's presence in local storage.
   */
  clearStorage(): void {
    localStorage.clear();
  }
}
