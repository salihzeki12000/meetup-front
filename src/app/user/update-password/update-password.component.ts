import { Component, OnInit, ViewContainerRef } from '@angular/core';
//import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from './../../socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { bypassSanitizationTrustResourceUrl } from '@angular/core/src/sanitization/bypass';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
  providers: [SocketService]

})
export class UpdatePasswordComponent implements OnInit {

  public userId: any;
  public userName: any;
  public authToken: any;
  public userInfo: any;
  public disconnectedSocket: any;

  public oldPassword: any;
  public password: any;
  public email: any;
  constructor(private _activatedrouter: ActivatedRoute, private http: HttpClient, private router: Router, public SocketService: SocketService,
    public AppService: AppService, private _location: Location, private toastr: ToastrService) {
    this.userId = Cookie.get('userId');

    this.userName = Cookie.get('userName');
  }
  ngOnInit() {
    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();



    this.checkStatus();
    

  }

 
  //check the status of the user
  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      this.toastr.warning('Some error occuried please login again !')
      return false;

    }

    else {
      return true;

    }
  } // end checkStatus

  // logout fuction
  public goToLogout: any = () => {
    let data = {
      authtoken: this.authToken,
      userId: this.userId
    }


    this.AppService.logOut(data)
      .subscribe((myResponse) => {
        if (myResponse.status === 200) {
          Cookie.deleteAll();
          setTimeout(() => this.toastr.success('Logged Out Sucessfully'))

          this.router.navigate(['/']);
        } else {
          this.toastr.error(myResponse.message)
        }
      }, (err) => {
        this.toastr.error(err.message)
      });
  } // end of logout function




  public goToProfile: any = () => {
    this.router.navigate(['/user/update-profile']);


  }

  public goToUpdatePassword: any = () => {

    this.router.navigate(['user/updatePassword']);

  }
  public updatePasswordBySystem() {

    if (!this.password) {
      this.toastr.error("Please enter new password")
    } else
      if (!this.oldPassword) {
        this.toastr.error("Please enter old password")
      } else if (this.password.length < 6) {
        this.toastr.warning('Minimum password length is 6')
      } 
      else {
        let data = {
          email: this.userInfo.email,
          password: this.password,
          authToken: this.authToken,
          oldPassword: this.oldPassword
        }
        this.AppService.updatePasswordBySystem(data).subscribe(
          (data) => {
            console.log(data)
            if (data.status == 200) {
              this.toastr.success("Password updated sucessfully")
              this.router.navigate(['/login']);

            } else {
              this.toastr.error("Error occured")

            }
          },
          (err) => {
           // this.toastr.error(err.message)
            this.toastr.error(err.error.message)

          }
        )

      }
  } // end og udpate password funtioin

}
