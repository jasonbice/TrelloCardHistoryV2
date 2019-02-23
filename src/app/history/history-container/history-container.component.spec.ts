import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HistoryContainerComponent } from './history-container.component';
import { HistoryItemListComponent } from '../history-item-list/history-item-list.component';
import { HistoryItemComponent } from '../history-item/history-item.component';
import { StringTruncatePipe } from 'src/app/shared/pipes/string-truncate.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import chrome from 'sinon-chrome';

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

  afterAll(() => {
    chrome.flush();
    delete window.chrome;
  });
});
