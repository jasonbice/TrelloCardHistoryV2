import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryItemListComponent } from './history-item-list.component';
import { HistoryItemComponent } from '../history-item/history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';

describe('HistoryItemListComponent', () => {
  let component: HistoryItemListComponent;
  let fixture: ComponentFixture<HistoryItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HistoryItemComponent,
        HistoryItemListComponent,
        StringTruncatePipe
      ]
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
