import { TestBed } from '@angular/core/testing';

import { TrelloDataService } from './trello-data.service';

describe('TrelloDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrelloDataService = TestBed.get(TrelloDataService);
    expect(service).toBeTruthy();
  });
});
