import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(public appService: AppService,
    public router: Router,
    private toastr: ToastrService) {
  }
  public email: any;
  public password: any;

  ngOnInit() {
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  }

  public goToResetPassword : any = () =>{
      if(!this.email){
      this.toastr.warning('Please enter Email')

      } else{

      

    this.router.navigate(['/user/resetPassword/'+this.email]);
      }
  }
  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

            
             Cookie.set('authtoken', apiResponse.data.authToken);
            
             Cookie.set('userId', apiResponse.data.userDetails.userId);
            
             Cookie.set('userName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
           

             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
             console.log(apiResponse)
             
             this.router.navigate(['/meet']);

          } else {

          //  console.log(apiResponse.error)

            this.toastr.error(apiResponse.message)

          }

        }, (err) => {
          //console.log(err)
        //  console.log(err.error.message)

          this.toastr.error(err.error.message)

        });

    } // end condition

  } // end signinFunction



}
