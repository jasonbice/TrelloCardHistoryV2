import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { ExtensionHostService } from './extension-host.service';

export enum StorageType {
  Local,
  Session,
  Sync
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private extensionHostService: ExtensionHostService) { }

  clear(storageType: StorageType = StorageType.Local): Observable<void> {
    if (chrome && chrome.storage) {
      return Observable.create((obs: Observer<any>) => {
        const callback = () => {
          obs.complete();
        };

        switch (storageType) {
          case StorageType.Local:
          case StorageType.Session:
            chrome.storage.local.clear(callback);
            break;

          case StorageType.Sync:
            chrome.storage.sync.clear(callback);
            break;
        }
      });
    }

    switch (storageType) {
      case StorageType.Local:
      case StorageType.Sync:
        return of(localStorage.clear());

      case StorageType.Session:
        return of(sessionStorage.clear());
    }
  }

  get(key: string, storageType: StorageType = StorageType.Local): Observable<any> {
    if (chrome && chrome.storage) {
      return Observable.create((obs: Observer<any>) => {
        const callback = (items: { [key: string]: any; }) => {
          obs.next(items[key]);
          obs.complete();
        };

        switch (storageType) {
          case StorageType.Local:
          case StorageType.Session:
            chrome.storage.local.get(key, callback);
            break;

          case StorageType.Sync:
            chrome.storage.sync.get(key, callback);
            break;
        }
      });
    } else {
      switch (storageType) {
        case StorageType.Local:
        case StorageType.Sync:
          return of(localStorage.getItem(key));
  
        case StorageType.Session:
          return of(sessionStorage.getItem(key));
      }
    }
  }

  set(items: Object, storageType: StorageType = StorageType.Local): Observable<any> {
    if (chrome && chrome.storage) {
      return Observable.create((obs: Observer<any>) => {
        const callback = () => {
          obs.complete();
        };

        switch (storageType) {
          case StorageType.Local:
          case StorageType.Session:
            chrome.storage.local.set(items, callback);
            break;

          case StorageType.Sync:
            chrome.storage.sync.set(items, callback);
            break;
        }
      });
    } else {
      const key: string = JSON.stringify(items[0]);
      const value: string = JSON.stringify(items[1]);

      switch (storageType) {
        case StorageType.Local:
        case StorageType.Sync:
          return of(localStorage.setItem(key, value));

        case StorageType.Session:
          return of(sessionStorage.setItem(key, value));
      }
    }
  }
}
