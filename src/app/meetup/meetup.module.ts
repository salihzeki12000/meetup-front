import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { RouterModule, Router } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { MeetingboardComponent } from './meetingboard/meetingboard.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import{SpringSpinnerModule} from 'angular-epic-spinners'


import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    SharedModule,
    OwlDateTimeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    OwlNativeDateTimeModule,
    SpringSpinnerModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot(),
    RouterModule.forChild(
      [
        { path: 'meet', component: MeetingboardComponent },
        { path: 'meet/:userId/create/:date', component: CreateMeetingComponent },
        { path: 'meet/:userId/details/:meetingId', component: CreateMeetingComponent },
        
      ]
    )

  ],
  declarations: [MeetingboardComponent, CreateMeetingComponent]
})
export class MeetupModule { }
