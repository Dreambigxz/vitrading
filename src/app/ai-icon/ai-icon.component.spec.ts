import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiIconComponent } from './ai-icon.component';

describe('AiIconComponent', () => {
  let component: AiIconComponent;
  let fixture: ComponentFixture<AiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
