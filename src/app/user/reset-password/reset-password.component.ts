import { Component, OnInit, ViewContainerRef } from '@angular/core';
//import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private _activatedrouter: ActivatedRoute, private router: Router,
    public AppService: AppService, private _location: Location, private toastr: ToastrService) {

  }

  public resetEmail: any;
  public resetPassword: any;
  public authToken: any;
  ngOnInit() {
    var email: string = this._activatedrouter.snapshot.paramMap.get('email');
    var authToken: string = this._activatedrouter.snapshot.paramMap.get('authToken');
    var resetEmail: string = this._activatedrouter.snapshot.paramMap.get('resetemail');

 
    if (email != null && email != 'undefined' && email != '') {
      this.sendResetLink(email)

    } else {
      this.resetEmail = resetEmail;
      this.authToken = authToken;
    }

  }

  // sending password reset link
  public sendResetLink: any = (email) => {

    this.AppService.resetPasswors(email).subscribe(
      (data) => {
        if (data.status == 200) {
          this.toastr.success(data.message)
          this.router.navigate(['/login']);

        } else {
          this.toastr.error("Some issue occured")
          this.router.navigate(['/login']);

        }
      },
      (err) => {
        this.toastr.error("Some issue occured")
        this.router.navigate(['/login']);

      }
    )
  } // end of function password link

  


  public updatePasswordByLink() {
    if (!this.resetPassword) {
      this.toastr.error("Please enter password")
    } 
    else
     if (this.resetPassword.length < 6) {
      this.toastr.warning('Minimum password length is 6')
    } 
    else {
      let data = {
        email: this.resetEmail,
        password: this.resetPassword,
        authToken: this.authToken
      }
      this.AppService.updatePasswordusingLink(data).subscribe(
        (data) => {
          if (data.status == 200) {
            this.toastr.success("Password updated sucessfully")
            this.router.navigate(['/login']);

          } else {
            this.toastr.error("Error occured")

          }
        },
        (err) => {
          this.toastr.error("Error occured")

        }
      )

    }
  } // end og udpate password funtioin
}
