import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondentsListComponent } from './correspondents-list.component';

describe('CorrespondentsListComponent', () => {
  let component: CorrespondentsListComponent;
  let fixture: ComponentFixture<CorrespondentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
