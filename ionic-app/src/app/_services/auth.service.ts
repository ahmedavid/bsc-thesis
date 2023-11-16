import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthUser, User } from '../models/models';

const baseUrl = 'http://localhost:5000/api/auth/';
const appString = 'telemedic';

/**
 * Auth service is responsible for sending HTTP calls to webapi in order to register and login the user 
 * Also keeps track of currenly loggedin user. Token is saved and retrieved from localStorage
 * */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
	jwtHelper = new JwtHelperService();
  decodedToken: AuthUser;
  user: User;

  constructor(private http: HttpClient, private router: Router) { }

  /**Login user by sending username and password combination. Receives a JWT Bearer token from webapi upon 
   * succesful authentication. Token is saved to localStorage, so that user is not required to login repeatedly.
   */
  login(credentials) {
    return this.http.post(baseUrl + 'login', credentials)
    .pipe(
        map((result: any) => {
            const user = result;
            if (user) {
              localStorage.setItem(appString, user.token);
              this.decodedToken = this.jwtHelper.decodeToken(user.token);
              this.setUser()
              console.log("TOKEN: ", this.decodedToken);
            }
        })
    );
  }
  /**
   * Register user with webapi
   * @param creds User supplied information
   */
  register(creds) {
    return this.http.post(baseUrl + 'register', creds);
  }

  /**Clears localStorage from saved token.Clears saved user information.User is logged out. */
  logout() {
    localStorage.removeItem(appString);
    this.decodedToken = null;
    this.router.navigate(['/']);
  }

  /**Checks if user is loggedin */
  loggedIn() {
    const token = localStorage.getItem(appString);
    return !!token;
  }

  /**Helper method to set decoded token from other services */
  setDocodedToken() {
    const token = localStorage.getItem(appString);
    this.decodedToken = this.jwtHelper.decodeToken(token);
    this.setUser();
  }

  /**Received socket id from Signaling server */
  updateSocketId(socketId: string){
    if(this.decodedToken) {
      this.decodedToken.socketId = socketId;
      this.user.socketId = socketId;
    }
  }

  setUser(){
    this.user = {
      fullname: this.decodedToken.given_name,
      id: +this.decodedToken.nameid,
      username: this.decodedToken.unique_name
    }
  }

  /**Helper method to determine if currenly loggedin user is a Doctor or Patient */
  public getTitle(){
    if(this.decodedToken && this.decodedToken.role === "True") {
      return 'Doctor'
    } else {
      return 'Patient'
    }
  }
}
