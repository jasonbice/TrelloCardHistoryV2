import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DiffComponent } from './diff.component';
import { HistoryMock } from '../shared/models/history/history.model.mock';
import { UpdateType } from '../shared/models/history/history-item.model';

describe('DiffComponent', () => {
  let component: DiffComponent;
  let fixture: ComponentFixture<DiffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffComponent);
    component = fixture.componentInstance;
    component.historyItem = HistoryMock.MOCK_HISTORY.historyItems.find(hi => hi.updateType === UpdateType.Description);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
