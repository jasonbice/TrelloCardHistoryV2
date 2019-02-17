import { Injectable } from '@angular/core';
import { ITrelloHistoryDataObj } from '../shared/models/trello/trello-history-data-obj.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TrelloDataService {

  constructor(private http: HttpClient) { }

  getRequestUri(shortLink: string): string {
    return `https://trello.com/1/cards/${shortLink}/actions?filter=createCard,convertToCardFromCheckItem,updateCard&limit=1000`
  }

  getTrelloHistoryDataObjects(shortLink: string): Observable<ITrelloHistoryDataObj[]> {
    let cardDataUri = this.getRequestUri(shortLink);

    return this.http.get<ITrelloHistoryDataObj[]>(cardDataUri);
  }
}