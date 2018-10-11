import { Component, OnInit, ViewContainerRef } from '@angular/core';
//import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.css']
})
export class ValidateEmailComponent implements OnInit {


  constructor(private _activatedrouter: ActivatedRoute, private router: Router,
    public AppService: AppService, private _location: Location, private toastr: ToastrService) {
  
  }
  ngOnInit() {
    var userId: string = this._activatedrouter.snapshot.paramMap.get('id');
    console.log(userId)

    this.validateEmail(userId);
  }

  public validateEmail(userId){
    console.log(userId);
    this.AppService.verifyEmail(userId).subscribe(
      (data) =>{
        if(data.status == 200){

        this.toastr.success("Email Validated Sucessfully")
     this.router.navigate(['/login']);

        }
      },
      (err)=>{
        this.toastr.error("unable to validate Email")
      this.router.navigate(['/login']);

      }
    )
  }

}
