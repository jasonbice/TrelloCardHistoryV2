import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HistoryContainerComponent } from './history-container.component';
import { HistoryItemComponent } from '../history-item/history-item.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import chrome from 'sinon-chrome';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { SortBy, HistoryItem, UpdateType } from 'src/app/shared/models/history/history-item.model';
import { HistoryMock } from 'src/app/shared/models/history/history.model.mock';
import { PrettifyHistoryValuePipe } from 'src/app/shared/pipes/prettify-history-value.pipe';
import { HistoryItemMenuComponent } from '../history-item-menu/history-item-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

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
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          maxOpened: 1,
          onActivateTick: true,
          preventDuplicates: true,
          progressBar: true,
          timeOut: 2500
        })
      ],
      declarations: [
        HistoryItemComponent,
        HistoryItemMenuComponent,
        HistoryContainerComponent,
        PrettifyHistoryValuePipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { shortLink: 'UEJpVbdt' }
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

    it('should load the history when running in extension mode', () => {
      coreService.isRunningInExtensionMode = true;
      spyOn(component, 'loadHistory').and.callThrough();

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(component.loadHistory).toHaveBeenCalled();
      });
    });

    it('should load the history when running in browser mode', () => {
      coreService.isRunningInExtensionMode = false;
      spyOn(component, 'loadHistory').and.callThrough();

      component.ngOnInit();

      fixture.whenStable().then(() => {
        expect(component.loadHistory).toHaveBeenCalled();
      });
    });

    describe('loadHistory', () => {
      it('should refresh the extension icon and badge', () => {
        coreService.isRunningInExtensionMode = true;
        spyOn(coreService, 'updateBadgeForCurrentTabByHistory').and.callThrough();

        component.loadHistory().then(() => {
          expect(coreService.updateBadgeForCurrentTabByHistory).toHaveBeenCalled();
        });
      });

      it('should set the component\'s shortLink', () => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.shortLink).toBe(HistoryMock.MOCK_SHORT_LINK);
        });
      });

      it('should set the component\'s history', () => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.history).toBe(HistoryMock.MOCK_HISTORY);
        });
      });

      it('should set the component\'s filteredHistoryItems', () => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.filteredHistoryItems).toBeTruthy();
        });
      });
    });

    describe('applyHistoryItemFilterAndSort', () => {
      it('should sort and filter the history items', () => {
        spyOn(component.historyItemFilter, 'filter').and.callThrough();
        spyOn(HistoryItem, 'sort').and.callThrough();

        component.loadHistory().then(() => {
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });
    });

    describe('clearChangeAuthorSelections', () => {
      it('should clear the selections from the filter and then apply the filter', () => {
        component.loadHistory().then(() => {
          component.historyItemFilter.memberCreatorIds.push('nonexistentid');

          spyOn(component.historyItemFilter, 'filter').and.callThrough();
          spyOn(HistoryItem, 'sort').and.callThrough();

          component.clearChangeAuthorSelections();

          expect(component.historyItemFilter.memberCreatorIds.length).toBe(0);
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });
    });

    describe('toggleChangeAuthorSelection', () => {
      it('should add an id to the filter when it doesn\'t exist and then apply the filter', () => {
        component.loadHistory().then(() => {
          spyOn(component.historyItemFilter, 'filter').and.callThrough();
          spyOn(HistoryItem, 'sort').and.callThrough();

          component.onFilterByMemberCreatorIdToggled('nonexistentid');

          expect(component.historyItemFilter.memberCreatorIds.length).toBe(1);
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });

      it('should remove an id from the filter when it exists and then apply the filter', () => {
        component.loadHistory().then(() => {
          const id: string = 'nonexistentid';

          component.historyItemFilter.memberCreatorIds.push(id);
          expect(component.historyItemFilter.memberCreatorIds.length).toBe(1);

          spyOn(component.historyItemFilter, 'filter').and.callThrough();
          spyOn(HistoryItem, 'sort').and.callThrough();

          component.onFilterByMemberCreatorIdToggled(id);

          expect(component.historyItemFilter.memberCreatorIds.length).toBe(0);
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });

      it('should not remove an id from the filter when another id was removed and then apply the filter', () => {
        component.loadHistory().then(() => {
          const id1: string = 'id1';
          const id2: string = 'id2';

          component.historyItemFilter.memberCreatorIds.push(id1);
          component.historyItemFilter.memberCreatorIds.push(id2);
          expect(component.historyItemFilter.memberCreatorIds.length).toBe(2);

          spyOn(component.historyItemFilter, 'filter').and.callThrough();
          spyOn(HistoryItem, 'sort').and.callThrough();

          component.onFilterByMemberCreatorIdToggled(id2);

          expect(component.historyItemFilter.memberCreatorIds.length).toBe(1);
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });
    });
  });

  describe('containsDescriptionChanges', () => {
    let historyMock: HistoryMock;
    let coreService: LegacyCoreService;
    let trelloDataService: TrelloDataService;
    let spyGetHistory: jasmine.Spy;

    beforeEach(() => {
      historyMock = HistoryMock.MOCK_HISTORY;
      coreService = TestBed.get(LegacyCoreService);
      trelloDataService = TestBed.get(TrelloDataService);

      component.history = historyMock;

      let qShortLink: any = new Promise((resolve, reject) => {
        resolve(HistoryMock.MOCK_SHORT_LINK);
      });

      spyOn(coreService, 'getTrelloCardIdFromCurrentUrl').and.returnValue(qShortLink);
    });

    it('should return true when the history contains description changes', () => {
      spyGetHistory = spyOn(trelloDataService, 'getHistory').and.returnValue(of(historyMock));

      fixture.whenStable().then(() => {
        expect(component.containsDescriptionChanges).toBeTruthy();
      });
    });

    it('should return false when the history does not contain description changes', () => {
      const noDescriptionHistoryItems = historyMock.historyItems.filter(hi => hi.updateType !== UpdateType.Description);

      spyGetHistory = spyOn(historyMock, 'historyItems').and.returnValue(noDescriptionHistoryItems);

      fixture.whenStable().then(() => {
        expect(component.containsDescriptionChanges).toBeFalsy();
      });
    });

    afterEach(() => {
      if (spyGetHistory) {
        spyGetHistory.and.callThrough();
      }
    });
  });

  describe('containsPointsChanges', () => {
    let historyMock: HistoryMock;
    let coreService: LegacyCoreService;
    let trelloDataService: TrelloDataService;
    let spyGetHistory: jasmine.Spy;

    beforeEach(() => {
      historyMock = HistoryMock.MOCK_HISTORY;
      coreService = TestBed.get(LegacyCoreService);
      trelloDataService = TestBed.get(TrelloDataService);

      component.history = historyMock;

      let qShortLink: any = new Promise((resolve, reject) => {
        resolve(HistoryMock.MOCK_SHORT_LINK);
      });

      spyOn(coreService, 'getTrelloCardIdFromCurrentUrl').and.returnValue(qShortLink);
    });

    it('should return true when the history contains points changes', () => {
      spyGetHistory = spyOn(trelloDataService, 'getHistory').and.returnValue(of(historyMock));

      fixture.whenStable().then(() => {
        expect(component.containsPointsChanges).toBeTruthy();
      });
    });

    it('should return false when the history does not contain points changes', () => {
      const noPointsHistoryItems = historyMock.historyItems.filter(hi => hi.updateType !== UpdateType.Points);

      spyGetHistory = spyOn(historyMock, 'historyItems').and.returnValue(noPointsHistoryItems);

      fixture.whenStable().then(() => {
        expect(component.containsPointsChanges).toBeFalsy();
      });
    });

    afterEach(() => {
      if (spyGetHistory) {
        spyGetHistory.and.callThrough();
      }
    });
  });

  describe('containsTitleChanges', () => {
    let historyMock: HistoryMock;
    let coreService: LegacyCoreService;
    let trelloDataService: TrelloDataService;
    let spyGetHistory: jasmine.Spy;

    beforeEach(() => {
      historyMock = HistoryMock.MOCK_HISTORY;
      coreService = TestBed.get(LegacyCoreService);
      trelloDataService = TestBed.get(TrelloDataService);

      component.history = HistoryMock.MOCK_HISTORY;

      let qShortLink: any = new Promise((resolve, reject) => {
        resolve(HistoryMock.MOCK_SHORT_LINK);
      });

      spyOn(coreService, 'getTrelloCardIdFromCurrentUrl').and.returnValue(qShortLink);
    });

    it('should return true when the history contains title changes', () => {
      spyGetHistory = spyOn(trelloDataService, 'getHistory').and.returnValue(of(historyMock));

      fixture.whenStable().then(() => {
        expect(component.containsTitleChanges).toBeTruthy();
      });
    });

    it('should return false when the history does not contain title changes', () => {
      const noTitleHistoryItems = historyMock.historyItems.filter(hi => hi.updateType !== UpdateType.Title);

      spyGetHistory = spyOn(historyMock, 'historyItems').and.returnValue(noTitleHistoryItems);

      fixture.whenStable().then(() => {
        expect(component.containsTitleChanges).toBeFalsy();
      });
    });

    afterEach(() => {
      if (spyGetHistory) {
        spyGetHistory.and.callThrough();
      }
    });
  });

  describe('applyHistoryItemFilterAndSort', () => {

  });

  describe('onFilterByMemberCreatorIdToggled', () => {
    it('should not have any member IDs in the filter by default', () => {
      expect(component.historyItemFilter.memberCreatorIds.length).toBe(0);
    });

    it('should add the supplied member ID to the filter when toggled and apply the sort/filter', () => {
      const filterByMemberId: string = 'testId';

      spyOn(component, 'applyHistoryItemFilterAndSort');

      component.onFilterByMemberCreatorIdToggled(filterByMemberId);

      const actualLength: number = component.historyItemFilter.memberCreatorIds.length;
      const expectedLength: number = 1;

      expect(actualLength).toBe(expectedLength);

      const actualMemberId: string = component.historyItemFilter.memberCreatorIds[0];
      const expectedMemberId: string = filterByMemberId;

      expect(actualMemberId).toBe(expectedMemberId);
      expect(component.applyHistoryItemFilterAndSort).toHaveBeenCalledTimes(1);
    });
  });
});
