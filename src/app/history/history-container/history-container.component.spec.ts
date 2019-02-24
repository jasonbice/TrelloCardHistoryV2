import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks, flush, flushMicrotasks } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HistoryContainerComponent } from './history-container.component';
import { HistoryItemListComponent } from '../history-item-list/history-item-list.component';
import { HistoryItemComponent } from '../history-item/history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import chrome from 'sinon-chrome';
import { ITrelloHistoryDataObj } from 'src/app/shared/models/trello/trello-history-data-obj.model';
import { History } from 'src/app/shared/models/history/history.model';
import { TrelloDataService } from 'src/app/services/trello-data.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LegacyCoreService } from 'src/app/services/legacy-core.service';
import { SortBy, HistoryItem } from 'src/app/shared/models/history/history-item.model';

const MOCK_CARD_JSON: string = '[{"id":"5c7182b7f60f6e4992bcac81","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"(5) Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed to remove Lorem Ipsum"},"old":{"desc":"Description changed to update Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}},"type":"updateCard","date":"2019-02-23T17:28:23.427Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c7182ae75c50a3b9746fd5f","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"(5) Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed to update Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},"old":{"desc":"Description changed to add Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}},"type":"updateCard","date":"2019-02-23T17:28:14.480Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71822b123d682929779bad","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"(5) Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed to add Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},"old":{"desc":"Description changed"}},"type":"updateCard","date":"2019-02-23T17:26:03.502Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71722d9ade35281cea4722","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"id":"5c7172038b60f1763599cc07","name":"(5) Mock Card - Updated Title"},"old":{"name":"(3) Mock Card - Updated Title"}},"type":"updateCard","date":"2019-02-23T16:17:49.328Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71722a3722b80eb07f2947","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"id":"5c7172038b60f1763599cc07","name":"(3) Mock Card - Updated Title"},"old":{"name":"Mock Card - Updated Title"}},"type":"updateCard","date":"2019-02-23T16:17:46.878Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71722270819e2c93724abc","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed"},"old":{"desc":"Description added"}},"type":"updateCard","date":"2019-02-23T16:17:38.043Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71721bee9cc526c722ab31","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description added"},"old":{"desc":""}},"type":"updateCard","date":"2019-02-23T16:17:31.689Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c7172123a502b11a742a932","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"id":"5c7172038b60f1763599cc07","name":"Mock Card - Updated Title"},"old":{"name":"Mock Card"}},"type":"updateCard","date":"2019-02-23T16:17:22.180Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c7172038b60f1763599cc08","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"Mock Card","id":"5c7172038b60f1763599cc07"}},"type":"createCard","date":"2019-02-23T16:17:07.324Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}}]'
const MOCK_TRELLO_HISTORY_DATA_OBJS: ITrelloHistoryDataObj[] = JSON.parse(MOCK_CARD_JSON);
const MOCK_SHORT_LINK: string = 'olZWuQJ6';
const MOCK_HISTORY: History = new History('olZWuQJ6', MOCK_TRELLO_HISTORY_DATA_OBJS);

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
        resolve(MOCK_SHORT_LINK);
      });

      spyOn(coreService, 'getTrelloCardIdFromCurrentUrl').and.returnValue(qShortLink);
      spyOn(trelloDataService, 'getHistory').and.returnValue(of(MOCK_HISTORY));
    });

    it('should set the title', async(() => {
      component.ngOnInit();

      fixture.whenStable().then(() => {
        const titleElement: HTMLElement = fixture.nativeElement.querySelector('h6');

        const actual = titleElement.innerHTML.trim();
        const expected = MOCK_HISTORY.title;

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
          expect(component.shortLink).toBe(MOCK_SHORT_LINK);
        });
      }));

      it('should set the component\'s history', async(() => {
        coreService.isRunningInExtensionMode = true;

        component.loadHistory().then(() => {
          expect(component.history).toBe(MOCK_HISTORY);
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

        console.log("test", MOCK_HISTORY);

        component.loadHistory().then(() => {
          expect(component.historyItemFilter.filter).toHaveBeenCalled();
          expect(HistoryItem.sort).toHaveBeenCalled();
        });
      });
    });
  });
});
