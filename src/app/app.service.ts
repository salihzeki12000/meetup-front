import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/do';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from '../../node_modules/rxjs';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private _http: HttpClient) { };

  //base url
 public baseUrl = 'http://meetupapi.venkatbijjam.in/api/v1';
  //public baseUrl = 'http://localhost:3000/api/v1';

  /** singup service 
   * inputs user details
   */
  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('password', data.password)
      .set('mobileNumber', data.mobileNumber)
      .set('isAdmin', data.isAdmin)
      .set('userName', data.userName)

    return this._http.post(`${this.baseUrl}/users/signup`, params);
  }

  /** login service 
   * taking email and password
   */
  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this._http.post(`${this.baseUrl}/users/login`, params);
  }


//edit user

public editUser(data): Observable<any> {
  const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobileNumber', data.mobileNumber)
    .set('userName', data.userName)
    .set('authToken', Cookie.get('authtoken'))


  return this._http.put(`${this.baseUrl}/users/${data.userId}/edit`, params);
}


  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }


  /** Logout service */

  public logOut(data): Observable<any> {
 
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

  return this._http.post(`${this.baseUrl}/users/logout?userId=${data.userId}`, params);

  }


  public setOnline(data) : Observable<any>{
  
    const params = new HttpParams()
    .set('authToken', Cookie.get('authtoken'))
   

return this._http.put(`${this.baseUrl}/users/${data.userId}/edit`, params);
  }

  public removeOnline () : Observable<any> {

    return this._http.get(`${this.baseUrl}/users/removeOnline?authToken=${Cookie.get('authtoken')}`);
    

  }

  /** getting all the user details */

  public getUserDetails() : Observable<any> {
    
    return this._http.get(`${this.baseUrl}/users/view/all?authToken=${Cookie.get('authtoken')}`);

  }

  public getSingleUserDetails(userId): Observable<any> {
   

    return this._http.get(`${this.baseUrl}/users/${userId}/details?authToken=${Cookie.get('authtoken')}`);
  }


  /** 
   * get the single meeting details by user
   */

   public getMeetingByUser(userId): Observable<any>{
    
    return this._http.get(`${this.baseUrl}/slot/MeetingByUser/${userId}?authToken=${Cookie.get('authtoken')}`);

   }

   

   /** create meeting */

   public createMeeting(meeting): Observable<any>{
    const params = new HttpParams()
    .set('email', meeting.email)
    .set('participantEmail', meeting.participantEmail)
    .set('meetingSubject', meeting.meetingSubject)
    .set('meetingDetails', meeting.meetingDetails)
    .set('location', meeting.location)
    .set('meetingStartDate', meeting.meetingStartTime)
    .set('meetingEndDate', meeting.meetingEndTime)
    .set('authToken', Cookie.get('authtoken'))

  return this._http.post(`${this.baseUrl}/slot/createMeeting`, params);
   }


/** update meeting details */


public updateMeetingData(meeting) : Observable<any> {

  const params = new HttpParams()
  .set('email', meeting.email)
  .set('participantEmail', meeting.participantEmail)
  .set('meetingSubject', meeting.meetingSubject)
  .set('meetingDetails', meeting.meetingDetails)
  .set('location', meeting.location)
  .set('meetingStartDate', meeting.meetingStartTime)
  .set('meetingEndDate', meeting.meetingEndTime)
  .set('authToken', Cookie.get('authtoken'))
  .set('meetingId',meeting.meetingId)

return this._http.post(`${this.baseUrl}/slot/updateMeeting`, params);


} // end of update meetings


/** update meeting details */


public dismissMeeting(meeting) : Observable<any> {

  const params = new HttpParams()
  .set('authToken', Cookie.get('authtoken'))
  .set('meetingId',meeting.meetingId)
  .set('remainder',"false")


return this._http.post(`${this.baseUrl}/slot/dismissMeeting`, params);


} // end of update meetings
   /** get all meeting details */

   public getAllMeetingDetails (): Observable<any> {

  return this._http.get(`${this.baseUrl}/slot/allMeeting?authToken=${Cookie.get('authtoken')}`);

   } // end of meeting retreving details


   /** delete meeting */

   
  public deleteMeeting(meetingId): Observable<any> {
 
    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'))

  return this._http.post(`${this.baseUrl}/slot/${meetingId}/deleteMeeting`, params);

  }

   /** get meeting by Meeting Id */


   public getMeetingDetailsById (meetingId) : Observable<any>{
  return this._http.get(`${this.baseUrl}/slot/meetingById/${meetingId}?authToken=${Cookie.get('authtoken')}`);

   }



   public verifyEmail(userId) : Observable<any> {
    const params = new HttpParams()
  
  return this._http.post(`${this.baseUrl}/users/${userId}/validate`,params);
  
  
  } // end of update meetings


  // send reset password link

  public resetPasswors(email): Observable<any> {
    const params = new HttpParams()
        .set('email',email)
    return this._http.post(`${this.baseUrl}/users/resetPassword`,params);
  
  } // end of password reset link


  // password update

  public updatePasswordusingLink(data) : Observable<any>{
    const params = new HttpParams()
    .set('email',data.email)
    .set('token',data.authToken)
    .set('password',data.password)

return this._http.post(`${this.baseUrl}/users/resetPasswordUpdate`,params);
  } // end of funtion


   // password update by system

   public updatePasswordBySystem(data) : Observable<any>{
    const params = new HttpParams()
    .set('email',data.email)
    .set('token',data.authToken)
    .set('oldPassword',data.oldPassword)
    .set('password',data.password)
    .set('authToken', Cookie.get('authtoken'))


return this._http.post(`${this.baseUrl}/users/checkPasswordUpdate`,params);
  } // end of funtion
}
