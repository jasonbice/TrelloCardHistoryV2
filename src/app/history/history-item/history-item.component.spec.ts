import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemComponent } from './history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';
import { UpdateType } from 'src/app/shared/models/history/history-item.model';
import { HistoryMock } from 'src/app/shared/models/history/history.model.mock';
import { IsNullOrWhiteSpace } from 'src/app/shared/utils';

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
    component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Created);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleNewValueCollapse', () => {
    it('should be collapsed by default', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedNewDescription && history.sanitizedNewDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const stringTruncatePipe: StringTruncatePipe = new StringTruncatePipe();

      fixture.detectChanges();
      
      const actual = fixture.nativeElement.querySelector('.history-item-changes-new').innerHTML;
      const expected = stringTruncatePipe.transform(component.historyItem.sanitizedNewDescription, component.MAX_VALUE_DISPLAY_LENGTH, component.TRUNCATE_APPEND);

      expect(actual).toBe(expected);
    });

    it('should be expanded when clicked', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedNewDescription && history.sanitizedNewDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const newValueElement: HTMLElement = fixture.nativeElement.querySelector('.history-item-changes-new');

      newValueElement.click();

      const actual = newValueElement.innerHTML;
      const expected = component.historyItem.sanitizedNewDescription;

      expect(actual).toBe(expected);
    });
  });

  describe('toggleOldValueCollapse', () => {
    it('should be collapsed by default', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedOldDescription && history.sanitizedOldDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const stringTruncatePipe: StringTruncatePipe = new StringTruncatePipe();

      fixture.detectChanges();
      
      const actual = fixture.nativeElement.querySelector('.history-item-changes-old').innerHTML;
      const expected = stringTruncatePipe.transform(component.historyItem.sanitizedOldDescription, component.MAX_VALUE_DISPLAY_LENGTH, component.TRUNCATE_APPEND);

      expect(actual).toBe(expected);
    });

    it('should be expanded when clicked', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && history.sanitizedOldDescription && history.sanitizedOldDescription.length > component.MAX_VALUE_DISPLAY_LENGTH);

      const oldValueElement: HTMLElement = fixture.nativeElement.querySelector('.history-item-changes-old');

      oldValueElement.click();

      const actual = oldValueElement.innerHTML;
      const expected = component.historyItem.sanitizedOldDescription;

      expect(actual).toBe(expected);
    });
  });

  describe('updateVerb', () => {
    it('should be VERB_ADDED when a Description is added for the first time', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && IsNullOrWhiteSpace(history.sanitizedOldDescription));

      const actual = component.updateVerb;
      const expected = component.VERB_ADDED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_ADDED when Points are added for the first time', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Points && history.sanitizedNewPoints !== null && history.sanitizedOldPoints === null);

      const actual = component.updateVerb;
      const expected = component.VERB_ADDED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CHANGED when the Description is changed from an existing non-null value to a new non-null value', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && !IsNullOrWhiteSpace(history.sanitizedOldDescription) && !IsNullOrWhiteSpace(history.sanitizedNewDescription));

      const actual = component.updateVerb;
      const expected = component.VERB_CHANGED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CHANGED when the Title is changed from an existing non-null value to a new value', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Title && !IsNullOrWhiteSpace(history.sanitizedNewTitle) && !IsNullOrWhiteSpace(history.sanitizedOldTitle));

      const actual = component.updateVerb;
      const expected = component.VERB_CHANGED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_CREATED when the card has been created', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Created);

      const actual = component.updateVerb;
      const expected = component.VERB_CREATED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_REMOVED when the Description is changed from a non-null value to a null value', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Description && !IsNullOrWhiteSpace(history.sanitizedOldDescription) && IsNullOrWhiteSpace(history.sanitizedNewDescription));

      const actual = component.updateVerb;
      const expected = component.VERB_REMOVED;

      expect(actual).toBe(expected);
    });

    it('should be VERB_REMOVED when the Points is changed from a non-null value to a null value', () => {
      component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(history => history.updateType === UpdateType.Points && history.sanitizedNewPoints === null && history.sanitizedOldPoints !== null);

      const actual = component.updateVerb;
      const expected = component.VERB_REMOVED;

      expect(actual).toBe(expected);
    });
  });
});
