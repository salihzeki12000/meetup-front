
import { CalenderComponent } from './calender/calender.component';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Router } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ToastrModule.forRoot(),
    RouterModule.forChild(
      [
        { path: 'calender', component: CalenderComponent }
      ]
    )

  ],
  declarations: [CalenderComponent,],
  exports: [
    CalenderComponent,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule { }



