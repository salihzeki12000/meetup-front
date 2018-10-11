import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';



import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit {


  //declaring the members
  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public userName: any;
  public isAdmin: any = true;
  marked = false;
  public admin = false;
  public data: any;
  public country: any;
  public adminseciton = false;

  public userForm: any;
  //private callingCode = '91';

  //initizaliting the contructots
  constructor(public appService: AppService, private http: HttpClient,
    public router: Router,
    private toastr: ToastrService) {
    //this.mobileNumber = this.callingCode;



  }


  ngOnInit() {
    this.http.get('https://restcountries.eu/rest/v2/all?fields=callingCodes;name')
      .subscribe((data: any) => {
        this.data = data;
      });



  }


  device: number = 1;

  onChange(event) {
    if (event.checked) {
      this.isAdmin = false
    } else {
      this.isAdmin = true
    }
  }



  toggleVisibility(e) {
    // this.marked = e.target.checked;
    //this.isAdmin = false;
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  }

  // singuo function 

  public signUpFunction: any = () => {
    // validate the input
    if (!this.firstName) {
      this.toastr.warning('Please enter First Name')

    } else if (!this.lastName) {
      this.toastr.warning('Please enter last name')

    } else if (!this.mobileNumber) {
      this.toastr.warning('Please enter mobile number')

    } else if (!this.email) {
      this.toastr.warning('Please enter email')

    } else if (!this.password) {
      this.toastr.warning('Please enter password')
    }
    else if (this.password.length < 6) {
      this.toastr.warning('Minimum password length is 6')
    }
    else if (this.firstName.length < 4) {
      this.toastr.warning('Minimum first Name length is 4')

    } else if (this.lastName.length < 3) {
      this.toastr.warning('Minimum last Name length is 3')
    }
    else if (!this.country ) {
      this.toastr.warning('please select country')

    }

    else if(!(/^\d{10}$/.test(this.mobileNumber))){
      
      this.toastr.warning('Mobile Number is invalid')

    } 

    else {
      // end of validation
      if (this.isAdmin) {
        this.userName = this.email.substring(0, this.email.lastIndexOf("@"));

      } else {
        this.userName = this.email.substring(0, this.email.lastIndexOf("@")) + "-admin";
        this.admin = true;
      }

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.country + this.mobileNumber,
        email: this.email,
        password: this.password,
        userName: this.userName,
        isAdmin: this.admin
      };

      this.appService.signupFunction(data).subscribe(
        (apiresponse) => {
          console.log(data)
          if (apiresponse.status == 200) {
            this.toastr.success('Verification Eamil sent');
            //setTimeout(() => {
            this.goToSignIn();
            // }, 2000);
          } else {
            this.toastr.error(apiresponse.message);

          }
        }, (err) => {
          console.log(err)
          this.toastr.error('Some Error Occurred!! Contact Admin');

        }
      )
    }
  } // end of sign up function


}
