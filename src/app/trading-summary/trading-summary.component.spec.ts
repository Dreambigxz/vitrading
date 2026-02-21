import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingSummaryComponent } from './trading-summary.component';

describe('TradingSummaryComponent', () => {
  let component: TradingSummaryComponent;
  let fixture: ComponentFixture<TradingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
