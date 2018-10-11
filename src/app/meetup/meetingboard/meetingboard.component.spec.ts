import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingboardComponent } from './meetingboard.component';

describe('MeetingboardComponent', () => {
  let component: MeetingboardComponent;
  let fixture: ComponentFixture<MeetingboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
