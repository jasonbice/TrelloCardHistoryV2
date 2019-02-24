import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HistoryContainerComponent } from './history-container.component';
import { HistoryItemListComponent } from '../history-item-list/history-item-list.component';
import { HistoryItemComponent } from '../history-item/history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import chrome from 'sinon-chrome';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { SortBy, HistoryItem } from 'src/app/shared/models/history/history-item.model';
import { HistoryMock } from 'src/app/shared/models/history/history.model.mock';

describe('HistoryContainerComponent', () => {
  let component: HistoryContainerComponent;
  let fixture: ComponentFixture<HistoryContainerComponent>;

  beforeAll(() => {
    window.chrome = chrome;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientModule
      ],
      declarations: [
        HistoryItemComponent,
        HistoryItemListComponent,
        HistoryContainerComponent,
        StringTruncatePipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { shortLink: 'olZWuQJ6' }
            }
          }
        },
        LegacyCoreService,
        TrelloDataService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be set to sort by Date descending', () => {
    expect(component.sortBy).toBe(SortBy.Date);
    expect(component.sortAscending).toBe(false);
  });

  afterAll(() => {
    chrome.flush();
    delete window.chrome;
  });

  describe('ngOnInit', () => {
    let coreService: LegacyCoreService;
    let trelloDataService: TrelloDataService;

    beforeEach(() => {
      coreService = TestBed.get(LegacyCoreService);
      trelloDataService = TestBed.get(TrelloDataService);

      let qShortLink: any = new Promise((resolve, reject) => {
        resolve(HistoryMock.MOCK_SHORT_LINK);
      });

      spyOn(coreService, 'getTrelloCardIdFromCurrentUrl').and.returnValue(qShortLink);
      spyOn(trelloDataService, 'getHistory').and.returnValue(of(HistoryMock.MOCK_HISTORY));
    });

    it('should set the title', async(() => {
      component.ngOnInit();

      fixture.whenStable().then(() => {
        const titleElement: HTMLElement = fixture.nativeElement.querySelector('h6');

        const actual = titleElement.innerHTML.trim();
        const expected = HistoryMock.MOCK_HISTORY.title;

        expect(actual).toBe(expected);
      });
    }));

    it('should show the last viewed date if the history has been previously viewed', async(() => {
      component.ngOnInit();

      fixture.whenStable().then(() => {
        component.history.lastViewed = new Date();

        fixture.detectChanges();

        const lastViewedElement: HTMLElement = fixture.nativeElement.querySelector('#lastViewed');
        const firstViewingElement: HTMLElement = fixture.nativeElement.querySelector('#firstViewing');

        expect(lastViewedElement).toBeTruthy();
        expect(firstViewingElement).toBeNull();
      });
    }));

    it('should show the last viewed data if the history has been previously viewed', async(() => {
      component.ngOnInit();

      fixture.whenStable().then(() => {
        component.history.lastViewed = null;

        fixture.detectChanges();

        const lastViewedElement: HTMLElement = fixture.nativeElement.querySelector('#lastViewed');
        const firstViewingElement: HTMLElement = fixture.nativeElement.querySelector('#firstViewing');

        expect(lastViewedElement).toBeNull();
        expect(firstViewingElement).toBeTruthy();
      });
    }));

    it('should load the history when running in extension mode', async(() => {
      coreService.isRunningInExtensionMode = true;
      spyOn(component, 'loadHistory').and.callThrough();

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(component.loadHistory).toHaveBeenCalled();
      });
    }));

    it('should load the history when running in browser mode', async(() => {
      coreService.isRunningInExtensionMode = false;
      spyOn(component, 'loadHistory').and.callThrough();

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(component.loadHistory).toHaveBeenCalled();
      });
    }));

    describe('loadHistory', () => {
      it('should refresh the extension icon and badge', async(() => {
        coreService.isRunningInExtensionMode = true;
        spyOn(coreService, 'updateBadgeForCurrentTabByHistory').and.callThrough();

        component.loadHistory().then(() => {
          expect(coreService.updateBadgeForCurrentTabByHistory).toHaveBeenCalled();
        });
      }));

      it('should set the component\'s shortLink', async(() => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.shortLink).toBe(HistoryMock.MOCK_SHORT_LINK);
        });
      }));

      it('should set the component\'s history', async(() => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.history).toBe(HistoryMock.MOCK_HISTORY);
        });
      }));

      it('should set the component\'s filteredHistoryItems', async(() => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.filteredHistoryItems).toBeTruthy();
        });
      }));
    });

    describe('applyHistoryItemFilterAndSort', () => {
      it('should sort and filter the history items', () => {
        spyOn(component.historyItemFilter, 'filter').and.callThrough();
        spyOn(HistoryItem, 'sort').and.callThrough();

        console.log("test", HistoryMock.MOCK_HISTORY);

        component.loadHistory().then(() => {
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });
    });
  });
});
