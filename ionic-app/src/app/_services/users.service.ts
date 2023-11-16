import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/api/bookings/';
/**
 * Retrieves user data from api
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(isBookee: boolean) {
    return this.http.get(baseUrl + 'users?isBookee=' + isBookee);
  }

  getUser(id: number) {
    return this.http.get(baseUrl + 'users/' + id);
  }

  getSpecialities() {
    return this.http.get(baseUrl + 'specialities');
  }
}
