import { TestBed, async } from '@angular/core/testing';

import { ExtensionHostService } from './extension-host.service';
import { AppRoutingModule } from '../app-routing.module';

describe('ExtensionHostService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule
      ]
    })
      .compileComponents();
  }));

  it('should be created', () => {
    const service: ExtensionHostService = TestBed.get(ExtensionHostService);
    expect(service).toBeTruthy();
  });
});
