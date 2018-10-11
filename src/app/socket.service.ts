import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class SocketService {

  public url = 'http://meetupapi.venkatbijjam.in';
 // public url = 'http://localhost:3000/';


  private socket;

    //base url
// public baseUrl = 'http://meetupapi.venkatbijjam.in/api/v1';
public baseUrl = 'http://meetupapi.venkatbijjam.in';

//public baseUrl = 'http://localhost:3000/';

  constructor(public http: HttpClient) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);

  }

  // events to be listened 

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end verifyUser



  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } // end setUser

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } // end onlineUserList


  public setOnline(data) : Observable<any>{
  
    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
   

    return this.http.put(`${this.baseUrl}/users/${data.userId}/edit`, params);
  }

  public removeOnline () : Observable<any> {

    return this.http.get(`${this.baseUrl}/users/removeOnline?authToken=${Cookie.get('authtoken')}`);
    

  }

  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); // end Socket

    }); // end Observable



  } // end disconnectSocket

  // send notification
  public SendNotification = (data) => {
    console.log("send remail")
    console.log(data)
    this.socket.emit('updates', data);

  } // end getChatMessage
  

  public receiveNotification = (email) => {
    //console.log(email)
    return Observable.create((observer) => {
      
      this.socket.on(email, (data) => {
        //console.log(email+"testing")

        observer.next(data);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId


  public receiveRemainders = () => {
    //console.log(email)
    return Observable.create((observer) => {
      
      this.socket.on('remainder-list', (reminderList) => {
        observer.next(reminderList);

      }); // end Socket

    }); // end Observable

  } // end chatByUserId

  public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
