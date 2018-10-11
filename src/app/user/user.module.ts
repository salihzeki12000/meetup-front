import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SingupComponent } from './singup/singup.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { RouterModule,Router, ActivatedRoute} from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatSelectModule, 
    MatInputModule,
MatFormFieldModule,
MatSlideToggleModule,
   
    RouterModule.forChild(
      [
        {path:'sign-up',component:SingupComponent},
        {path:'user/validateEmail/:id',component:ValidateEmailComponent},
        {path:'user/resetPassword/:email', component:ResetPasswordComponent},
        {path:'user/:resetemail/resetPassword/:authToken',component:ResetPasswordComponent},
        {path:'user/update-profile',component:UpdateProfileComponent},
        {path:'user/updatePassword',component:UpdatePasswordComponent}
        
      ]
    )

  ],
  declarations: [LoginComponent, SingupComponent,ValidateEmailComponent, ResetPasswordComponent, UpdateProfileComponent, UpdatePasswordComponent]
})
export class UserModule { }
