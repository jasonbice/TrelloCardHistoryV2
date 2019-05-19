import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemComponent } from './history-item.component';
import { UpdateType } from 'src/app/shared/models/history/history-item.model';
import { HistoryMock } from 'src/app/shared/models/history/history.model.mock';
import { PrettifyHistoryValuePipe } from 'src/app/shared/pipes/prettify-history-value.pipe';
import { ITrelloMemberCreator } from 'src/app/shared/models/trello/trello-member-creator.model';
import { Utils } from 'src/app/shared/utils';
import { HistoryItemMenuComponent } from '../history-item-menu/history-item-menu.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HistoryItemComponent', () => {
  let component: HistoryItemComponent;
  let fixture: ComponentFixture<HistoryItemComponent>;
  let historyMock: HistoryMock = new HistoryMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          maxOpened: 1,
          onActivateTick: true,
          preventDuplicates: true,
          progressBar: true,
          timeOut: 2500
        })
      ],
      declarations: [HistoryItemComponent, HistoryItemMenuComponent, PrettifyHistoryValuePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryItemComponent);
    component = fixture.componentInstance;
    component.historyItem = historyMock.historyItems.find(hi => hi.updateType === UpdateType.Created);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // e2e
  xit('should display the author\'s avatar if they have one', () => {
    component.historyItem.trelloHistoryDataObj.memberCreator.avatarUrl = 'https://trello-avatars.s3.amazonaws.com/bf043662d540a9c0e405e4df1f30479e';
    component.historyItem.trelloHistoryDataObj.memberCreator.initials = 'JB';

    fixture.detectChanges();

    const avatarElement: HTMLElement = fixture.nativeElement.querySelector('#memberCreatorAvatar');
    const initialsElement: HTMLElement = fixture.nativeElement.querySelector('#memberCreatorInitials');

    expect(avatarElement).toBeTruthy();
    expect(initialsElement).toBeNull();
  });

  // e2e
  xit('should display the author\'s initials if they don\'t have an avatar', () => {
    component.historyItem.trelloHistoryDataObj.memberCreator.avatarUrl = null;
    component.historyItem.trelloHistoryDataObj.memberCreator.initials = 'JB';

    fixture.detectChanges();

    const avatarElement: HTMLElement = fixture.nativeElement.querySelector('#memberCreatorAvatar');
    const initialsElement: HTMLElement = fixture.nativeElement.querySelector('#memberCreatorInitials');

    expect(avatarElement).toBeNull();
    expect(initialsElement).toBeTruthy();
  });

  // e2e
  xit('should display a \'new\' badge if the item has not been seen before', () => {
    component.historyItem.isNew = true;

    fixture.detectChanges();

    const isNewBadge: HTMLElement = fixture.nativeElement.querySelector('.badge-warning');

    expect(isNewBadge).toBeTruthy();
  });

  // e2e
  xit('should not display a \'new\' badge if the item has been seen before', () => {
    component.historyItem.isNew = false;

    fixture.detectChanges();

    const isNewBadge: HTMLElement = fixture.nativeElement.querySelector('.badge-warning');

    expect(isNewBadge).toBeNull();
  });

  // e2e
  xdescribe('onNewExpandToggled', () => {
    it('should be collapsed by default', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedNewDescription && history.sanitizedNewDescription.length > PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH);

      const pipe: PrettifyHistoryValuePipe = new PrettifyHistoryValuePipe();

      fixture.detectChanges();

      const actual = fixture.nativeElement.querySelector('.history-item-changes-new').innerHTML;
      const expected = pipe.transform(component.historyItem.sanitizedNewDescription);

      expect(actual).toBe(expected);
    });

    it('should be expanded when clicked', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedNewDescription && history.sanitizedNewDescription.length > PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH);

      const newValueElement: HTMLElement = fixture.nativeElement.querySelector('.history-item-changes-new');

      newValueElement.click();

      fixture.detectChanges();

      const actual = newValueElement.innerHTML;
      const expected = component.historyItem.sanitizedNewDescription;

      expect(actual).toBe(expected);
    });
  });

  // e2e
  xdescribe('onOldExpandToggled', () => {
    it('should be collapsed by default', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedOldDescription && history.sanitizedOldDescription.length > PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH);

      const pipe: PrettifyHistoryValuePipe = new PrettifyHistoryValuePipe();

      fixture.detectChanges();

      const actual = fixture.nativeElement.querySelector('.history-item-changes-old').innerHTML;
      const expected = pipe.transform(component.historyItem.sanitizedOldDescription);

      expect(actual).toBe(expected);
    });

    it('should be expanded when clicked', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedOldDescription && history.sanitizedOldDescription.length > PrettifyHistoryValuePipe.DEFAULT_MAX_LENGTH);

      const oldValueElement: HTMLElement = fixture.nativeElement.querySelector('.history-item-changes-old');

      oldValueElement.click();

      fixture.detectChanges();

      const actual = oldValueElement.innerHTML;
      const expected = component.historyItem.sanitizedOldDescription;

      expect(actual).toBe(expected);
    });
  });

  describe('isOnlyChangeAuthor', () => {
    it(`should return true when the history item's author is the only change author within the history`, () => {
      component.allChangeAuthors = [component.historyItem.trelloHistoryDataObj.memberCreator];

      expect(component.isOnlyChangeAuthor).toBeTruthy();
    });

    it(`should return false when the history item's author is not the only change author within the history`, () => {
      const mockChangeAuthor: ITrelloMemberCreator = {
        avatarHash: 'avatarHash',
        avatarUrl: 'avatarUrl',
        id: 'testId',
        initials: 'TI',
        fullName: 'Test Id',
        username: 'testId'
      };

      component.allChangeAuthors = [component.historyItem.trelloHistoryDataObj.memberCreator, mockChangeAuthor];

      expect(component.isOnlyChangeAuthor).toBeFalsy();
    });

  });

  describe('updateVerb', () => {
    it('should be VERB_ADDED when a Description is added for the first time', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && Utils.isNullOrWhiteSpace(history.sanitizedOldDescription));

      const actual = component.updateVerb;
      const expected = component.VERB_ADDED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_ADDED when Points are added for the first time', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Points && history.sanitizedNewPoints !== null && history.sanitizedOldPoints === null);

      const actual = component.updateVerb;
      const expected = component.VERB_ADDED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CHANGED when the Description is changed from an existing non-null value to a new non-null value', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && !Utils.isNullOrWhiteSpace(history.sanitizedOldDescription) && !Utils.isNullOrWhiteSpace(history.sanitizedNewDescription));

      const actual = component.updateVerb;
      const expected = component.VERB_CHANGED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CHANGED when the Title is changed from an existing non-null value to a new value', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Title && !Utils.isNullOrWhiteSpace(history.sanitizedNewTitle) && !Utils.isNullOrWhiteSpace(history.sanitizedOldTitle));

      const actual = component.updateVerb;
      const expected = component.VERB_CHANGED;

      expect(actual).toBe(expected);
    });

    xit('should be VERB_CONVERTED when the card has been converted from a checklist item', () => {
      // TODO: Need a mock with Converted
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Converted);

      const actual = component.updateVerb;
      const expected = component.VERB_CONVERTED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CREATED when the card has been created', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Created);

      const actual = component.updateVerb;
      const expected = component.VERB_CREATED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_REMOVED when the Description is changed from a non-null value to a null value', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Description && !Utils.isNullOrWhiteSpace(history.sanitizedOldDescription) && Utils.isNullOrWhiteSpace(history.sanitizedNewDescription));

      const actual = component.updateVerb;
      const expected = component.VERB_REMOVED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_REMOVED when the Points are changed from a non-null value to a null value', () => {
      component.historyItem = historyMock.historyItems.find(history => history.updateType === UpdateType.Points && history.sanitizedNewPoints === null && history.sanitizedOldPoints !== null);

      const actual = component.updateVerb;
      const expected = component.VERB_REMOVED;

      expect(actual).toBe(expected);
    });
  });

});
