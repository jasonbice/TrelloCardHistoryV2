import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryItemListComponent } from './history-item-list.component';

describe('HistoryItemListComponent', () => {
  let component: HistoryItemListComponent;
  let fixture: ComponentFixture<HistoryItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
