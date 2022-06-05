import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondentComponent } from './correspondent.component';

describe('CorrespondentComponent', () => {
  let component: CorrespondentComponent;
  let fixture: ComponentFixture<CorrespondentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
