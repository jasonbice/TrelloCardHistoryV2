import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemComponent } from './history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';
import { History } from 'src/app/shared/models/history/history.model';
import { UpdateType } from 'src/app/shared/models/history/history-item.model';
import { ITrelloHistoryDataObj } from 'src/app/shared/models/trello/trello-history-data-obj.model';

const MOCK_CARD_JSON: string = '[{"id":"5c7182b7f60f6e4992bcac81","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"(5) Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed to remove Lorem Ipsum"},"old":{"desc":"Description changed to update Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}},"type":"updateCard","date":"2019-02-23T17:28:23.427Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c7182ae75c50a3b9746fd5f","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"(5) Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed to update Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},"old":{"desc":"Description changed to add Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}},"type":"updateCard","date":"2019-02-23T17:28:14.480Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71822b123d682929779bad","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"(5) Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed to add Lorem Ipsum  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},"old":{"desc":"Description changed"}},"type":"updateCard","date":"2019-02-23T17:26:03.502Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71722d9ade35281cea4722","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"id":"5c7172038b60f1763599cc07","name":"(5) Mock Card - Updated Title"},"old":{"name":"(3) Mock Card - Updated Title"}},"type":"updateCard","date":"2019-02-23T16:17:49.328Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71722a3722b80eb07f2947","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"id":"5c7172038b60f1763599cc07","name":"(3) Mock Card - Updated Title"},"old":{"name":"Mock Card - Updated Title"}},"type":"updateCard","date":"2019-02-23T16:17:46.878Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71722270819e2c93724abc","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description changed"},"old":{"desc":"Description added"}},"type":"updateCard","date":"2019-02-23T16:17:38.043Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c71721bee9cc526c722ab31","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"Mock Card - Updated Title","id":"5c7172038b60f1763599cc07","desc":"Description added"},"old":{"desc":""}},"type":"updateCard","date":"2019-02-23T16:17:31.689Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c7172123a502b11a742a932","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"card":{"shortLink":"UEJpVbdt","idShort":32,"id":"5c7172038b60f1763599cc07","name":"Mock Card - Updated Title"},"old":{"name":"Mock Card"}},"type":"updateCard","date":"2019-02-23T16:17:22.180Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}},{"id":"5c7172038b60f1763599cc08","idMemberCreator":"54fce1401bf86d141f6d4326","data":{"board":{"shortLink":"olZWuQJ6","name":"Trello Card History Development","id":"5a24376ecf0da9d971048058"},"list":{"name":"Backlog","id":"5a24378873c3fb5f54030d0f"},"card":{"shortLink":"UEJpVbdt","idShort":32,"name":"Mock Card","id":"5c7172038b60f1763599cc07"}},"type":"createCard","date":"2019-02-23T16:17:07.324Z","limits":{},"memberCreator":{"id":"54fce1401bf86d141f6d4326","avatarHash":"bf043662d540a9c0e405e4df1f30479e","avatarUrl":"https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e","fullName":"Jason Bice","idMemberReferrer":null,"initials":"JB","nonPublic":{},"username":"jasonbice2"}}]'
const MOCK_TRELLO_HISTORY_DATA_OBJS: ITrelloHistoryDataObj[] = JSON.parse(MOCK_CARD_JSON);
const MOCK_HISTORY: History = new History('olZWuQJ6', MOCK_TRELLO_HISTORY_DATA_OBJS);

describe('HistoryItemComponent', () => {
  let component: HistoryItemComponent;
  let fixture: ComponentFixture<HistoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryItemComponent, StringTruncatePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryItemComponent);
    component = fixture.componentInstance;
    component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Created);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleNewValueCollapse', () => {
    it('should be collapsed by default', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedNewDescription && history.sanitizedNewDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const stringTruncatePipe: StringTruncatePipe = new StringTruncatePipe();

      fixture.detectChanges();
      
      const actual = fixture.nativeElement.querySelector('.history-item-changes-new').innerHTML;
      const expected = stringTruncatePipe.transform(component.historyItem.sanitizedNewDescription, component.MAX_VALUE_DISPLAY_LENGTH, component.TRUNCATE_APPEND);

      expect(actual).toBe(expected);
    });

    it('should be expanded when clicked', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedNewDescription && history.sanitizedNewDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const newValueElement: HTMLElement = fixture.nativeElement.querySelector('.history-item-changes-new');

      newValueElement.click();

      const actual = newValueElement.innerHTML;
      const expected = component.historyItem.sanitizedNewDescription;

      expect(actual).toBe(expected);
    });
  });

  describe('toggleOldValueCollapse', () => {
    it('should be collapsed by default', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedOldDescription && history.sanitizedOldDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const stringTruncatePipe: StringTruncatePipe = new StringTruncatePipe();

      fixture.detectChanges();
      
      const actual = fixture.nativeElement.querySelector('.history-item-changes-old').innerHTML;
      const expected = stringTruncatePipe.transform(component.historyItem.sanitizedOldDescription, component.MAX_VALUE_DISPLAY_LENGTH, component.TRUNCATE_APPEND);

      expect(actual).toBe(expected);
    });

    it('should be expanded when clicked', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedOldDescription && history.sanitizedOldDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const oldValueElement: HTMLElement = fixture.nativeElement.querySelector('.history-item-changes-old');

      oldValueElement.click();

      const actual = oldValueElement.innerHTML;
      const expected = component.historyItem.sanitizedOldDescription;

      expect(actual).toBe(expected);
    });
  });

  describe('updateVerb', () => {
    it('should be VERB_ADDED when a Description is added for the first time', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && !history.trelloHistoryDataObj.data.old.desc);

      const actual = component.updateVerb;
      const expected = component.VERB_ADDED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_ADDED when Points are added for the first time', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Points && history.sanitizedNewPoints && !history.sanitizedOldPoints);

      const actual = component.updateVerb;
      const expected = component.VERB_ADDED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CHANGED when the Description is changed from an existing non-null value to a new value', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.trelloHistoryDataObj.data.card.desc !== null && history.trelloHistoryDataObj.data.old.desc !== null);

      const actual = component.updateVerb;
      const expected = component.VERB_CHANGED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CHANGED when the Title is changed from an existing non-null value to a new value', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Title && history.trelloHistoryDataObj.data.card.name !== null && history.trelloHistoryDataObj.data.old.name !== null);

      const actual = component.updateVerb;
      const expected = component.VERB_CHANGED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CREATED when the card has been created', () => {
      component.historyItem = MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Created);

      const actual = component.updateVerb;
      const expected = component.VERB_CREATED;

      expect(actual).toBe(expected);
    });
  });
});
