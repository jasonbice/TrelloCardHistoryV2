import { TestBed } from '@angular/core/testing';

import { LegacyCoreService } from './legacy-core.service';

describe('LegacyCoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegacyCoreService = TestBed.get(LegacyCoreService);
    expect(service).toBeTruthy();
  });
});
