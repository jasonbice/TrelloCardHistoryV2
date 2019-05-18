import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryItemMenuComponent } from './history-item-menu.component';

describe('HistoryItemMenuComponent', () => {
  let component: HistoryItemMenuComponent;
  let fixture: ComponentFixture<HistoryItemMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
