import { TestBed } from '@angular/core/testing';

import { TrelloDataService } from './trello-data.service';
import { HttpClientModule } from '@angular/common/http';

describe('TrelloDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: TrelloDataService = TestBed.get(TrelloDataService);
    expect(service).toBeTruthy();
  });
});
