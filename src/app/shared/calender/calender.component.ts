
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef ,  ViewEncapsulation
} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView ,CalendarEventTitleFormatter,CalendarMonthViewDay} from 'angular-calendar';
import {  OnChanges, Input, EventEmitter, Output, OnInit } from '@angular/core';

import { CustomEventTitleFormatter } from './custom-title';
//import {meetingDetails} from '../../meetup/meetingboard/meetingboard.component'

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};



@Component({
  selector: 'app-calender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
  
  
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})



export class CalenderComponent implements OnInit{

  @Output() meetingDetails = new EventEmitter();
  @Output() meetingPlan = new EventEmitter();
  
  @Input() events :any;

  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();




  refresh: Subject<any> = new Subject();

  
  activeDayIsOpen: boolean = false;
  selectedMonthViewDay: CalendarMonthViewDay;


  constructor(private modal: NgbModal) { 
  }
 

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        var send={
          date: date,
          action:"create"
        }
    this.meetingPlan.emit(send);
      } else {
        this.activeDayIsOpen = true;
        var send={
          date: date,
          action:"edit"
        }
    this.meetingPlan.emit(send);

      }

    }
  }


  
  handleEvent(action: string, event: CalendarEvent): void {
    this.meetingDetails.emit(event);
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  ngOnInit(): void {



  
  }

  
}