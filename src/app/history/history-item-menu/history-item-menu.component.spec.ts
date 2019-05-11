import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryItemMenuComponent } from './history-item-menu.component';

describe('HistoryItemMenuComponent', () => {
  let component: HistoryItemMenuComponent;
  let fixture: ComponentFixture<HistoryItemMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryItemMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryItemMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
