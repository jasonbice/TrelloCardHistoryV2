import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemComponent } from './history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';
import { HistoryItem } from 'src/app/shared/models/history/history-item.model';
import { ITrelloHistoryData } from 'src/app/shared/models/trello/trello-history-data.model';
import { ITrelloHistoryDataObj } from 'src/app/shared/models/trello/trello-history-data-obj.model';
import { ITrelloMemberCreator } from 'src/app/shared/models/trello/trello-member-creator.model';

const mockTrelloHistoryData_updateCard: ITrelloHistoryData = {
  board: { id: 'boardId' },
  card: {
    id: 'cardId',
    idShort: 'idShort',
    name: 'cardName',
    desc: 'cardDesc',
    shortLink: 'cardShortLink'
  },
  list: {
    id: 'listId',
    name: 'listName'
  },
  old: {
    desc: 'oldDesc',
    name: 'oldName',
    idList: 'oldIdList'
  }
};

const mockTrelloMemberCreator: ITrelloMemberCreator = {
  avatarHash: 'avatarHash',
  avatarUrl: 'avatarUrl',
  fullName: 'Jason Bice',
  id: 'id',
  initials: 'JB',
  username: 'jasonbice'
};

const mockTrelloHistoryDataObj_updateCard: ITrelloHistoryDataObj = {
  data: mockTrelloHistoryData_updateCard,
  date: new Date(),
  id: 'test id',
  idMemberCreator: 'test idMemberCreator',
  memberCreator: mockTrelloMemberCreator,
  type: 'updateCard'
};

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

    component.historyItem = new HistoryItem(mockTrelloHistoryDataObj_updateCard);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
