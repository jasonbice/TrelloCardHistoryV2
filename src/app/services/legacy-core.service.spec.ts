import { TestBed } from '@angular/core/testing';

import { LegacyCoreService } from './legacy-core.service';
import { HistoryMock } from '../shared/models/history/history.model.mock';

describe('LegacyCoreService', () => {
  let service: LegacyCoreService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(LegacyCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTrelloCardIdFromUrl', () => {
    it('should return the card ID (\'short link\') from a valid URL', () => {
      const actual = service.getTrelloCardIdFromUrl('https://trello.com/c/UEJpVbdt/32-5-mock-card-updated-title');
      const expected = HistoryMock.MOCK_SHORT_LINK;

      expect(actual).toBe(expected);
    });

    it('should return null for an invalid URL', () => {
      const actual = service.getTrelloCardIdFromUrl(`https://www.someothersite.com/c/${HistoryMock.MOCK_SHORT_LINK}/`);

      expect(actual).toBeNull();
    });

    it('should return null for the board URL', () => {
      const boardUrl = 'https://trello.com/b/olZWuQJ6/trello-card-history-development';

      const actual = service.getTrelloCardIdFromUrl(boardUrl);

      expect(actual).toBeNull();
    });
  });
});
