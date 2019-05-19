import { async, TestBed } from '@angular/core/testing';
import { TrelloDataService } from './trello-data.service';
import { HttpClientModule } from '@angular/common/http';
import { HistoryMock } from '../shared/models/history/history.model.mock';

describe('TrelloDataService', () => {
  let service: TrelloDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });

    service = TestBed.get(TrelloDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHistoryRequestUri', () => {
    it('should return the Trello API URI formulated with the provided short link', () => {
      const actual = service.getHistoryRequestUri(HistoryMock.MOCK_SHORT_LINK);
      const expected = `https://trello.com/1/cards/${HistoryMock.MOCK_SHORT_LINK}/actions?filter=createCard,copyCard,convertToCardFromCheckItem,updateCard&limit=1000`;

      expect(actual).toBe(expected);
    });
  });

  describe('getHistory', () => {
    let historyMock: HistoryMock = new HistoryMock();

    it('should get the history via the Trello API', (done: DoneFn) => {
      service.getHistory(HistoryMock.MOCK_SHORT_LINK).subscribe(history => {
        expect(history).toBeTruthy();
        expect(history.historyItems).toBeTruthy();
        expect(history.historyItems.length).toBeGreaterThanOrEqual(historyMock.historyItems.length);

        done();
      });
    });
  });

});