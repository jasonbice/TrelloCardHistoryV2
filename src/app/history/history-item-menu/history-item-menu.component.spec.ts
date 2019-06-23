import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemMenuComponent } from './history-item-menu.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('HistoryItemMenuComponent', () => {
  let component: HistoryItemMenuComponent;
  let fixture: ComponentFixture<HistoryItemMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
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
      declarations: [HistoryItemMenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryItemMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleExpand', () => {
    it('should emit expandToggled', () => {
      component.expandToggled.subscribe(x => {
        expect(x).toBeNull();
      });

      component.toggleExpand();
    });
  });
});
