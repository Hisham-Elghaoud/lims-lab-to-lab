import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCorrespondentComponent } from './new-correspondent.component';

describe('NewCorrespondentComponent', () => {
  let component: NewCorrespondentComponent;
  let fixture: ComponentFixture<NewCorrespondentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCorrespondentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCorrespondentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
