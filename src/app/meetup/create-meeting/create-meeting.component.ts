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

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css'],
  providers: [SocketService]

})
export class CreateMeetingComponent implements OnInit {



  constructor(private _activatedrouter: ActivatedRoute, private router: Router, public SocketService: SocketService,
    public AppService: AppService, private _location: Location, private toastr: ToastrService) {
    this.userId = Cookie.get('userId');

    this.userName = Cookie.get('userName');
  }

  public authToken: any;
  public userInfo: any;
  public userId: any;
  public userName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;


  public allUsers;

  public onlineUsers: any = [];

  public participantDetails: any = [];
  public partipantMeetingDetails = [];
public partipantCompletedMeetingDetails =[];
  public dateTime: Date;

  public meetingStartTime: Date;
  public meetingEndTime: Date;

  public meetingSubject: any;
  public meetingDetails: any;
  public meetingLocation: any;
  public participantEmail: any;
  public userStatus = "Available";
  public meetingSelect: any;

  public meetingDelete = false;
  public meetingEdit = false;
  public create= true;
  public edit= false;
  public delete =false;
  public meetingCompletedSelect:any;
  public readOnly = false;
  public hostEmail: any;
  public display = false;

  public min = new Date();

    // Max moment: April 21 2018, 20:30
    public max = new Date(new Date().getFullYear(), 11, 31);

  ngOnInit() {

    this.display =true;
    let participantId: string = this._activatedrouter.snapshot.paramMap.get('userId');
    let meetingId: string = this._activatedrouter.snapshot.paramMap.get('meetingId');
    let meetingPlanDate: string = this._activatedrouter.snapshot.paramMap.get('date');
    this.meetingStartTime= new Date(meetingPlanDate);
    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.hostEmail =this.userInfo.email;
    


    this.checkStatus();



    this.getParticipantDetails(participantId);
    this.getParticipantMeetingDetails(participantId,meetingId);

    /** check meeting Id */
   //this.meetingSelect="msLBhCg1R"
   
  }



 
  //check the status of the user
  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      this.toastr.warning('Some error occuried please login again !')
      return false;

    } else if (this.userInfo.admin) {
      return true;

    } else {
      this.router.navigate(['/meet']);

      this.toastr.warning('Not have access !')
      return false;
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

  /** get the  participant user details  */

  public getParticipantDetails: any = (userId) => {

    this.AppService.getSingleUserDetails(userId).subscribe(
      (data) => {
        console.log(data)
        if(data.data!=null){

        
        this.participantDetails = data.data;
        this.participantEmail = this.participantDetails.email;
        console.log(this.participantDetails)
        } else{

        }
      },
      (err) => {
        console.log("no  user details found")
      }
    )
  } // end of participant details retreving

  public getParticipantMeetingDetails: any = (userId,meetingId) => {
    var loop = true;
    this.AppService.getMeetingByUser(userId).subscribe(
      (data) => {
        if (data.data != null) {
          data.data.forEach(meeting => {
            if (meeting.meetingEndDate > moment.utc().format()) {
              this.partipantMeetingDetails.push(meeting);
              if(meeting.meetingId==meetingId){
               this.meetingSelect= meetingId;
               this.meetingSelected(meetingId);

              }

              if (!moment(data.data[0].meetingEndDate).isAfter(moment.utc().format()) && loop) {
                this.userStatus = "In a Meeting";
                loop = false;
              }
            } else{
              this.partipantCompletedMeetingDetails.push(meeting);
              if(meeting.meetingId==meetingId){
                this.meetingCompletedSelect= meetingId;
                this.meetingCompletedSelected(meetingId);
 
               }
            
            }

            
          });

          // check inputed meeting Id
          setTimeout(() => {
            this.display = false;
          }, 2000);

        } else{
          this.toastr.warning("No Meeting Details are found")
          //this.router.navigate(['/meet']);
          this.display = false;

        }


      },
      (err) => {
        console.log("no meeting details found")
        setTimeout(() => {
          this.display = false;
        }, 1000);
      }
    )
    //console.log(this.partipantMeetingDetails)

  } // end of retreving meeting details


  //creating meeting

  public createMeeting: any = () => {
    this.display =true;

    //validating input

    if (!this.userInfo.email) {
      this.toastr.warning('Host Details are Missing')

    } else if (!this.participantEmail) {
      this.toastr.warning('Participant Details are Missing')

    } else if (!this.meetingSubject) {
      this.toastr.warning('Meeting subject is missing')

    } else if (!this.meetingLocation) {
      this.toastr.warning('Meeting location is Missing')

    } else if (!this.meetingStartTime) {
      this.toastr.warning('Meeting start Time is missing')
    }
    else if (!this.meetingEndTime) {
      this.toastr.warning('Meeting End Time is missing')

    }

    else if (!this.meetingDetails) {
      this.toastr.warning('Meeting Details are missing')

    }
    else {
      let meeting = {
        email: this.userInfo.email,
        participantEmail: this.participantEmail,
        meetingSubject: this.meetingSubject,
        meetingDetails: this.meetingDetails,
        location: this.meetingLocation,
        notify:"Meeting is created by "+ this.userInfo.firstName,
        meetingStartTime: moment.utc(this.meetingStartTime).format(),
        meetingEndTime: moment.utc(this.meetingEndTime).format()
      };

      this.AppService.createMeeting(meeting).subscribe(
        (myResponse) => {
          if (myResponse.status == 200) {
            console.log("created")
            this.toastr.success('Meeting Created');
           
            this.SocketService.SendNotification(meeting)

            this.router.navigate(['/meet']);
            

          } else {
            this.toastr.error('Some issue please try later');
            this.display=false;
          }
        },

        (err) => {
         
        //  this.toastr.error('Some issue please try later');
          this.toastr.error(err.error.message)
          this.display=false;



        }
      )
    }
  } // end of create function

  public meetingSelected: any = (meetingId) => {
    
    this.meetingSelect = meetingId;
    this.meetingEdit = true;
    this.meetingDelete = true;
    //console.log(meetingId)
    this.meetingSubject= null;
    this.meetingLocation=null;
    this.meetingDetails = null;
    this.meetingStartTime= null;
    this.meetingEndTime= null;
    this.create =false;;
    this.edit=false;
    this.delete =false;
    this.readOnly=true;
    this.meetingCompletedSelect= false;

    this.AppService.getMeetingDetailsById(this.meetingSelect).subscribe(
      (data) =>{
        if(data.data!=null){
         this.meetingSubject= data.data.meetingSubject;
         this.meetingLocation=data.data.location;
         this.meetingDetails = data.data.meetingDetails;
         this.meetingStartTime= data.data.meetingStartDate;
         this.meetingEndTime= data.data.meetingEndDate;
         this.hostEmail =data.data.hostEmail;
        
        } else{

        this.toastr.error("Invalid Meeting details")
        }
      }, 
      (err) =>{
        this.toastr.error(err.error.message)

      }
    )
  } //highligting the meeting 

  public meetingCompletedSelected :any = (meetingId)=>{
    this.display =true;
    this.meetingCompletedSelect = meetingId;
    this.create =false;
    this.meetingSelect="";
    this.edit=false;
    this.delete =false;
    this.meetingEdit=false;
    this.AppService.getMeetingDetailsById(this.meetingCompletedSelect).subscribe(
      (data) =>{
        if(data.data!=null){
         this.meetingSubject= data.data.meetingSubject;
         this.meetingLocation=data.data.location;
         this.meetingDetails = data.data.meetingDetails;
         this.meetingStartTime= data.data.meetingStartDate;
         this.meetingEndTime= data.data.meetingEndDate;
          this.hostEmail =data.data.hostEmail;
          this.readOnly= true;
        }
        else{
        this.toastr.warning("some erro Occurred")

        }
        this.display =false;
      }, 
      (err) =>{
        this.toastr.error(err.error.message)
        this.display =false;

      }
    )
  }
  //edit meeting
  public editMeeting : any= () =>{
    this.readOnly =false;
    this.AppService.getMeetingDetailsById(this.meetingSelect).subscribe(
      (data) =>{
        if(data.data!=null){
         this.meetingSubject= data.data.meetingSubject;
         this.meetingLocation=data.data.location;
         this.meetingDetails = data.data.meetingDetails;
         this.meetingStartTime= data.data.meetingStartDate;
         this.meetingEndTime= data.data.meetingEndDate;
         this.hostEmail =data.data.hostEmail;

          this.create =false;
          this.edit=true;
          this.delete=false;
        }
      }, 
      (err) =>{

      }
    )
  } // end of edit

  public editMeetingData :any = () =>{

    this.display =true;
     //validating input

     if (!this.userInfo.email) {
      this.toastr.warning('Host Details are Missing')

    } else if (!this.participantEmail) {
      this.toastr.warning('Participant Details are Missing')

    } else if (!this.meetingSubject) {
      this.toastr.warning('Meeting subject is missing')

    } else if (!this.meetingLocation) {
      this.toastr.warning('Meeting location is Missing')

    } else if (!this.meetingStartTime) {
      this.toastr.warning('Meeting start Time is missing')
    }
    else if (!this.meetingEndTime) {
      this.toastr.warning('Meeting End Time is missing')

    }

    else if (!this.meetingDetails) {
      this.toastr.warning('Meeting Details are missing')

    }
    else {
      let meeting = {
        email: this.userInfo.email,
        participantEmail: this.participantEmail,
        meetingSubject: this.meetingSubject,
        meetingDetails: this.meetingDetails,
        location: this.meetingLocation,
        notify:"Meeting is updated by "+ this.userInfo.firstName,
        meetingStartTime: moment.utc(this.meetingStartTime).format(),
        meetingEndTime: moment.utc(this.meetingEndTime).format(),
        meetingId: this.meetingSelect
      };
      console.log(meeting)

      this.AppService.updateMeetingData(meeting).subscribe(
        (myResponse) => {
          if (myResponse.status == 200) {
            this.toastr.success('Meeting Updated');
            this.router.navigate(['/meet']);
            this.SocketService.SendNotification(meeting)

          } else {
           // console.log(myResponse)
          this.toastr.error("Unable to edit details");

          }
          this.display =false;
        },

        (err) => {
          console.log("err")
          this.toastr.error(err.error.message);

          this.display =false;

        }
      )
    }
  } // edit data


  public deleteMeeting :any= () =>{
    this.display =true;
    this.readOnly=true;
    this.AppService.getMeetingDetailsById(this.meetingSelect).subscribe(
      (data) =>{
        if(data.data!=null){
         this.meetingSubject= data.data.meetingSubject;
         this.meetingLocation=data.data.location;
         this.meetingDetails = data.data.meetingDetails;
         this.meetingStartTime= data.data.meetingStartDate;
         this.meetingEndTime= data.data.meetingEndDate;
         this.create =false;
         this.edit=false;
         this.delete =true;

        } else{
          this.toastr.error("Unable to fetch data")
        }
        this.display =false;
      }, 
      (err) =>{
        this.toastr.error(err.error.message)
//        console.log("some error")
this.display =false;

      }
    )
   
  } // end of delete meeting

  public getMessageFromAUser :any =()=>{
    console.log("socket message" + this.userInfo.email)
    var email= this.userInfo.email;
    this.SocketService.receiveNotification(email).subscribe((data)=>{
    this.toastr.success(data.notify);

    });//end subscribe

}// end get message from a user 


public deleteMeetingData : any =() =>{
  this.display =true
  let meeting = {
    email: this.userInfo.email,
    participantEmail: this.participantEmail,
    notify:`Meeting is Deleted by ${this.userInfo.firstName} on ${this.meetingSubject}` 
  
  };

  this.AppService.deleteMeeting(this.meetingSelect).subscribe(
    (data) =>{
      if(data.status ==200){
        this.toastr.success('Meeting Deleted');
        this.router.navigate(['/meet']);
        this.SocketService.SendNotification(meeting)
      
        
      } else{
        this.toastr.error("some error occured while deletign")

      }
      this.display =false;
    }, 
    (err) =>{
      this.toastr.error(err.error.message)
      this.display =false;

    }
  )
}

  public clearSelection : any =() =>{
    this.meetingSubject= null;
    this.meetingLocation=null;
    this.meetingDetails = null;
    this.meetingStartTime= null;
    this.meetingEndTime= null;
    this.create =true;;
    this.edit=false;
    this.delete =false;
    this.readOnly=false;
    this.meetingEdit=false;
    this.meetingSelect = null
    this.meetingCompletedSelect=null;
    ;

  } // end of clear selection


  // check meeting is valid or not

 
}

