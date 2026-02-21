import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAiComponent } from './create-ai.component';

describe('CreateAiComponent', () => {
  let component: CreateAiComponent;
  let fixture: ComponentFixture<CreateAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
