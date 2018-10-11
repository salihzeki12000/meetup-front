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
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  providers: [SocketService]

})

export class UpdateProfileComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, public SocketService: SocketService,
    public AppService: AppService, private _location: Location, private toastr: ToastrService) {
    this.userId = Cookie.get('userId');

    this.userName = Cookie.get('userName');
  }

  public userId: any;
  public userName: any;
  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public authToken: any;
  public userInfo: any;
  public disconnectedSocket: boolean;
  public data: any;

  ngOnInit() {

    this.http.get('https://restcountries.eu/rest/v2/all?fields=callingCodes;name')
      .subscribe((data: any) => {
        this.data = data;
      });
    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();



    this.checkStatus();
    if (this.checkStatus()) {
      this.getUserDetails()

    }
  }

  onSelectCountry(callingCode) {
    //console.log(callingCode)
    this.mobileNumber = callingCode;
  }

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
  public getMessageFromAUser :any =()=>{
    console.log("socket message" + this.userInfo.email)
    var email= this.userInfo.email;
    this.SocketService.receiveNotification(email).subscribe((data)=>{
    this.toastr.success(data.notify);

    });//end subscribe

}// end get message from a user 

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

 
  // get user details
  public getUserDetails: any = () => {

    this.AppService.getSingleUserDetails(this.userInfo.userId).subscribe(
      (data) => {
        if (data != null) {
          if (this.userInfo != null) {
            this.userId = data.data.userId;
            this.email = data.data.email;
            this.firstName = data.data.firstName;
            this.lastName = data.data.lastName;
            this.mobileNumber = data.data.mobileNumber;
          }
        } else {
          this.toastr.error('Some error occured');
          this.router.navigate(['/meet']);

        }

      },
      (err) => {

        this.toastr.error('Some error occured');
        this.router.navigate(['/meet']);

      }
    )



  } // end of user details

  public UpdateDetails: any = () => {
    // validate the input
    if (!this.firstName) {
      this.toastr.warning('Please enter First Name')

    } else if (!this.lastName) {
      this.toastr.warning('Please enter last name')

    } else if (!this.mobileNumber) {
      this.toastr.warning('Please enter mobile number')

    } else if (!this.email) {
      this.toastr.warning('Please enter email')

    } 
    else if (this.firstName.length < 4) {
      this.toastr.warning('Minimum first Name length is 4')

    } else if (this.lastName.length < 3) {
      this.toastr.warning('Minimum last Name length is 3')
    }

    else if(!(/^\d{12}$/.test(this.mobileNumber))){
      
      this.toastr.warning('Mobile Number is invalid')

    } 
    
    
    else {
      // end of validation


      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        userName: this.userName,
        userId: this.userId
      };

      this.AppService.editUser(data).subscribe(
        (apiresponse) => {
          console.log(data)
          if (apiresponse.status == 200) {
            this.toastr.success('update successful');
            this.router.navigate(['/meet']);


          } else {
            // this.toastr.error(apiresponse.message);
            this.toastr.error('Some Error Occurred!! Contact Admin');

          }
        }, (err) => {
         // console.log(err)
        //  this.toastr.error('Some Error Occurred!! Contact Admin');
          this.toastr.error(err.error.message)

        }
      )
    }
  } // end of sign up function

  

}
