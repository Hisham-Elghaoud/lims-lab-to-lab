import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSampleComponent } from './draw-sample.component';

describe('DrawSampleComponent', () => {
  let component: DrawSampleComponent;
  let fixture: ComponentFixture<DrawSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
