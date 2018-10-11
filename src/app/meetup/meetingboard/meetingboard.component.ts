import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from './../../socket.service';

import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { element } from '@angular/core/src/render3/instructions';

import * as moment from 'moment';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { moveEmbeddedView } from '@angular/core/src/view';
import { mergeMapTo } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-meetingboard',
  templateUrl: './meetingboard.component.html',
  styleUrls: ['./meetingboard.component.css'],
  providers: [SocketService]
})


export class MeetingboardComponent implements OnInit {

  constructor(
    public AppService: AppService,
    public router: Router,
    public SocketService: SocketService,
    private toastr: ToastrService
  ) {

    this.userId = Cookie.get('userId');

    this.userName = Cookie.get('userName');

  }

  /**
   * 
   * 
   * 
   */
  public authToken: any;
  public userInfo: any;
  public userId: any;
  public userName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public model = 'none';

  public allUsers;

  public onlineUsers: any = [];


  /** meeting realted varibles */

  public addMeeting = false;
  public userSelect = "";
  public partipantMeetingDetails = [];
  //public events :any;
  public events: any = [];
  public upCommingMeeting: any = [];
  public meetingSelect: any;
  public meetingPlanDate: any;
  public completedMeeting: any = [];
  public meetingCompletedSelect: any;
  public clearSelection = false;
  public admin = false;
  public display = false;
  public remainderSubject;
  public remainderHost;
  public remainderLocation;
  public remainderDetails;
  public remainderTime;
  public remainderList = [];
  ngOnInit() {
    this.display = true;

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.AppService.getUserInfoFromLocalstorage();

    if (this.userInfo.admin) {
      this.admin = true;
    }
    console.log(this.userInfo)
    this.checkStatus();
    this.verifyUserConfirmation();
    //this.getOnlineUserList()
    this.getALlUsers();
    this.meetingDashboard();
    this.getMessageFromAUser();
    this.getRemainder();
  }



  openModalDialog() {
    this.model = 'block'; //Set block css
  }
  Snooze() {
    this.model = 'none'; //set none css after close dialog
  }

  closeModalDialog() {
    this.model = 'none'; //set none css after close dialog

    this.remainderList.forEach(meeting => {
//console.log(meet)
      //this.AppService.dismissMeeting(meet).subscribe((data))
      this.AppService.dismissMeeting(meeting).subscribe(
        (data) => {
        
        },
        (err) => {

        })



    }); // end of loop
    this.toastr.success("Meetings are dismissed")


  }

  //check the status of the user
  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      this.toastr.warning('Some error occuried please login again !')
      return false;

    } else {
      setTimeout(() => this.toastr.success('MeetUP Welcomes you'))
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
          localStorage.clear();
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
  /** 
     * retreve all the users in application
     */

  public getALlUsers: any = () => {
    this.AppService.getUserDetails().subscribe(
      (data) => {
        this.allUsers = data.data;
      },
      (err) => {
        this.toastr.error("Some Error occured please contact Admin")
      }
    )
  }



  public verifyUserConfirmation: any = () => {
    this.SocketService.verifyUser()
      .subscribe((data) => {

        this.disconnectedSocket = false;
        this.SocketService.setUser(this.authToken);
        this.getOnlineUserList();
      });
  }

  public getOnlineUserList: any = () => {

    this.SocketService.onlineUserList().subscribe((userList) => {
      this.onlineUsers = [];
      this.onlineUsers = userList;
    }, (err) => {
    });
  }




  public getMessageFromAUser: any = () => {
    var email = this.userInfo.email;
    this.SocketService.receiveNotification(email).subscribe((data) => {
      this.toastr.success(data.notify);
      this.meetingDashboard();

    });//end subscribe

  }// end get message from a user 


  public getRemainder: any = () => {
   // console.log("rem")
    var count = 1;
    var userId = this.userInfo.userId;
    this.SocketService.receiveRemainders().subscribe((data) => {
    this.remainderList = [];
     
      if (data != null) {
        data.forEach(meet => {
          if (meet.participentId == this.userInfo.userId) {
            let rem = {
              meetingDetails: meet.meetingDetails,
              remainderHost: meet.hostName,
              location: meet.location,
              meetingSubject: meet.meetingSubject,
              meetingStartDate: meet.meetingStartDate,
              meetingEndDate:meet.meetingEndDate,
              meetingId:meet.meetingId

            }
            this.remainderList.push(rem);
            if (count = 1) {
              this.toastr.success("Your meeting is approching");
              count++;
            }

            this.openModalDialog();
          }
        });



      }
      // console.log("rem1")

      //this.meetingDashboard();

    });//end subscribe

  }// end get message from a user 



  /** meeting related functions */
  status: boolean = false;

  public userSelected: any = (event, userId) => {
    //this.display = true;
    this.userSelect = userId;
    this.meetingSelect = null;
    this.addMeeting = true;
    this.meetingPlanDate = moment().format();

    this.events = [];
    this.clearSelection = true;
    this.AppService.getMeetingByUser(userId).subscribe(
      (data) => {
        if (data.data != null) {
          data.data.forEach(meeting => {

            var meetingSubject = meeting.meetingSubject;
            var meetingParticipent = meeting.participentName;
            var host = meeting.hostName;
            if (this.userInfo.admin) {
              var title = "on " + meetingSubject + " with " + meetingParticipent + " at " + meeting.location;
            }
            else {
              var title = "on " + meetingSubject + " with " + host + " at " + meeting.location;

            }
            this.events.push({
              start: new Date(meeting.meetingStartDate),
              end: new Date(meeting.meetingEndDate),
              title: title,
              color: colors.red,
              meetingId: meeting.meetingId,
              participantId: meeting.participentId
            });
          });
          this.display = false;

        } else {
          this.toastr.warning("No Meeting scheduled")
          //this.display = false;

        }


      },
      (err) => {
        // console.log("no meeting details found")
        this.toastr.warning("some error occured")
        this.display = false;

      }
    )

  }



  public meetingDashboard: any = () => {


    if (this.userInfo.admin) {

      this.AppService.getAllMeetingDetails().subscribe(
        (data) => {
          this.events = [];
          this.completedMeeting = [];
          this.upCommingMeeting = [];

          if (data.data != null) {
            data.data.forEach(meeting => {
              if (meeting.meetingEndDate >= moment.utc().format()) {
                this.upCommingMeeting.push(meeting);
              } else {
                this.completedMeeting.push(meeting);

              }
              var meetingSubject = meeting.meetingSubject;
              var meetingParticipent = meeting.participentName;
              var host = meeting.hostName;
              var title = "on " + meetingSubject + " with " + meetingParticipent + " at " + meeting.location;


              this.events.push({
                start: new Date(meeting.meetingStartDate),
                end: new Date(meeting.meetingEndDate),
                title: title,
                color: colors.blue,
                meetingId: meeting.meetingId,
                participantId: meeting.participentId
              });

            });

          }

          setTimeout(() => {
            this.display = false;

          }, 2000);

        },
        (err) => {
          setTimeout(() => {
            this.display = false;

          }, 2000);
          this.toastr.error("Some error occurred ")
        }
      )

    } else {

      this.AppService.getMeetingByUser(this.userInfo.userId).subscribe(
        (data) => {
          this.events = [];
          this.completedMeeting = [];
          this.upCommingMeeting = [];

          if (data.data != null) {
            data.data.forEach(meeting => {
              if (meeting.meetingEndDate >= moment.utc().format()) {
                this.upCommingMeeting.push(meeting);
              } else {
                this.completedMeeting.push(meeting);

              }
              var meetingSubject = meeting.meetingSubject;
              var meetingParticipent = meeting.participentName;
              var host = meeting.hostName;

              var title = "on " + meetingSubject + " with " + host + " at " + meeting.location;


              this.events.push({
                start: new Date(meeting.meetingStartDate),
                end: new Date(meeting.meetingEndDate),
                title: title,
                color: colors.blue,
                meetingId: meeting.meetingId,
                participantId: meeting.participentId
              });


              //this.events.push(meetingData);
            });

            setTimeout(() => {
              this.display = false;
            }, 2000);
          }
          else {
            // this.toastr.warning("Some error occured")
            this.display = false;
          }

        },
        (err) => {
          this.toastr.error("some erro occurred")
          setTimeout(() => {
            this.display = false;
          }, 2000);
        }
      )
    }




  } // emd of meeting dashboard function


  /** clear selection */

  /** input from calendar */

  public detailfromCalender(event) {

    console.log(event)
    this.router.navigate(['/meet/' + event.participantId + '/details/' + event.meetingId]);

  }

  public meetingPlan(event) {
   // console.log(event)

    if (this.userSelect) {
      this.meetingPlanDate = moment(event.date).format();
    }
  }


  /** get meeting data in dash board */
  public getMeetinginDashboard(meetingId) {
    this.display = true;
    this.userSelect = null;
    this.events = [];
    this.clearSelection = true;
    this.AppService.getMeetingDetailsById(meetingId).subscribe(

      (data) => {
        if (data.data != null) {
          this.meetingSelect = meetingId;
          var meetingSubject = data.data.meetingSubject;
          var meetingParticipent = data.data.participentName;
          var host = data.data.hostName;
          if (this.userInfo.admin) {
            var title = "on " + meetingSubject + " with " + meetingParticipent + " at " + data.data.location;
          }
          else {
            var title = "on " + meetingSubject + " with " + host + " at " + data.data.location;

          }
          this.events.push({
            start: new Date(data.data.meetingStartDate),
            end: new Date(data.data.meetingEndDate),
            title: title,
            color: colors.red,
            meetingId: data.data.meetingId,
            participantId: data.data.participentId
          });

        }
        this.display = false;
      },
      (err) => {
        this.display = false;
        this.toastr.error("Some erro Occured")
      }
    )
  }

  // get completed meetings
  public getCompletedMeetinginDashboard(meetingId) {
    this.display = true;
    this.userSelect = null;
    this.events = [];
    this.meetingCompletedSelect = meetingId;
    this.meetingSelect = null;
    this.clearSelection = true;
    this.AppService.getMeetingDetailsById(meetingId).subscribe(

      (data) => {
        if (data.data != null) {
          var meetingSubject = data.data.meetingSubject;
          var meetingParticipent = data.data.participentName;
          var host = data.data.hostName;
          if (this.userInfo.admin) {
            var title = "on " + meetingSubject + " with " + meetingParticipent + " at " + data.data.location;
          }
          else {
            var title = "on " + meetingSubject + " with " + host + " at " + data.data.location;

          }
          this.events.push({
            start: new Date(data.data.meetingStartDate),
            end: new Date(data.data.meetingEndDate),
            title: title,
            color: colors.red,
            meetingId: data.data.meetingId,
            participantId: data.data.participentId
          });

        }
        this.display = false;
      },
      (err) => {
        this.display = false;
        this.toastr.error("Some Error Occcured")
      }
    )
  } // end of function

  // clear selection

  public clear() {
    this.addMeeting = false;
    this.userSelect = null;
    this.meetingSelect = null;
    this.meetingCompletedSelect = null;
    this.clearSelection = false;
    this.meetingDashboard();
  }


}

