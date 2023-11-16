import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:5000/api/bookings/';

/**
 * Service responsible for sending api calls in order to retrieve bookings , make a new booking and cancel a booking
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  /**Makes a new booking in database */
  makeBooking(data) {
    return this.http.post(baseUrl, data);
  }

  /**
   * Get patients bookings
   * @param id Patients user id
   */
  getBookingsByBookerId(id: number) {
    return this.http.get(baseUrl + 'bookers/' + id);
  }

  /**
   * Get Doctors bookings
   * @param id Doctors user id
   */
  getBookingsByBookeeId(id: number) {
    return this.http.get(baseUrl + 'bookees/' + id);
  }

  /**Delete a booking from database */
  cancelConsultation(bookingId) {
    return this.http.delete(baseUrl + bookingId, {});
  }
}
