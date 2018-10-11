import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

//importing route
import { RouterModule, Router } from '@angular/router'
import { UserModule } from './user/user.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './user/login/login.component';
import { MeetupModule } from './meetup/meetup.module';
import {SharedModule} from './shared/shared.module';
import { AppService } from './app.service';
import { FormsModule } from '@angular/forms';

import{SpringSpinnerModule} from 'angular-epic-spinners';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
 
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    SharedModule,
    MeetupModule,
    HttpClientModule,
  
    SpringSpinnerModule,
    FormsModule,

    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: PageNotFoundComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
    )
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
