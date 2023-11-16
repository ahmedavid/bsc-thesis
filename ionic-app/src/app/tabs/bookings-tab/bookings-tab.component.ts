import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { BookingService } from 'src/app/_services/booking.service';

@Component({
  selector: 'app-bookings-tab',
  templateUrl: './bookings-tab.component.html',
  styleUrls: ['./bookings-tab.component.scss'],
})
export class BookingsTabComponent implements OnInit {

  bookings = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router
    ) { }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.getBookingData(() => {});
  }
  
  getBookingData(finishedCallback) {
    if (this.authService.decodedToken && this.authService.decodedToken.nameid) {
      if ( this.authService.decodedToken.role === 'True') {
        this.bookingService.getBookingsByBookeeId(+this.authService.decodedToken.nameid).subscribe(
          (bookings: any[]) => {
            console.log("Doctor Bookings: ", bookings);
            this.bookings = bookings;
            finishedCallback();
          }
        );
  
      } else {
        this.bookingService.getBookingsByBookerId(+this.authService.decodedToken.nameid).subscribe(
          (bookings: any[]) => {
            console.log("Patient Bookings: ", bookings);
            this.bookings = bookings;
            finishedCallback();
          }
        );
      }
    }
  }

  getUserDisplayData(finishedCallback: () => {}) {
    if (this.bookings.length === 0) {
      return [];
    } else {
      if (this.authService.decodedToken && this.authService.decodedToken.nameid) {
        if ( this.authService.decodedToken.role === 'True') {
          return this.bookings.map(b => {
            const result = {
              bookingId: b.id,
              bookerId: b.bookerId,
              bookeeId: b.bookeeId,
              fullname: b.booker.fullname,
              photoUrl: b.booker.photoUrl? b.booker.photoUrl : 'assets/patient.png',
              speciality: 'N/A',
              startTime: b.startTime,
              endTime: b.endTime,
            };
            return result;
          });
        } else {
          return this.bookings.map(b => {
            const result = {
              bookingId: b.id,
              bookerId: b.bookerId,
              bookeeId: b.bookeeId,
              fullname: b.bookee.fullname,
              photoUrl: b.bookee.photoUrl? b.bookee.photoUrl : 'assets/doctor-icon.jpg',
              speciality: b.bookee.speciality,
              startTime: b.startTime,
              endTime: b.endTime,
            };
            return result;
          });
        }
      }
    }
  }

  async startConsultation(booking) {
    const currDateTime = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    const bookeeId = booking.bookeeId;
    if (currDateTime >= startTime && currDateTime < endTime ) {
      console.log('Consultation can start')
      const alert = await this.alertCtrl.create({
        message: 'Are you ready to start the consultation session?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Yes',
            handler: () => {
              const b = booking;
              this.router.navigate(['/menu/tabs/consultation/'+booking.bookingId+'/'+bookeeId+'/'+booking.bookerId],{state:{booking:b}})
            }
          }
        ]
      });
      alert.present();
    } else {
      console.log('Cant start consultation')
      const alert = await this.alertCtrl.create({
        message: 'Can\'t start Consultation Session out of booking time',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    }
  }

  async cancelConsultation(booking) {
    const alert = await this.alertCtrl.create({
      message: 'Are you sure to cancel this booking?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Yes',
          handler: () => {
            this.bookingService.cancelConsultation(booking.bookingId).subscribe(result =>{
              this.bookings = this.bookings.filter(b => b.id !== booking.bookingId)
              this.toastCtrl.create({
                message: 'Booking Cancelled!',
                color: 'success',
                duration: 1000
              })
              .then(t => t.present())
              .catch(err => console.log('Booking Cancel Error:',err))
            });
          }
        }
      ]
    });
    alert.present();
  }

  doRefresh(event) {
    console.log('Refresh event:', event)
    this.getBookingData(() => {
      event.target.complete();
    });
  }

  ionViewWillLeave() {
    console.log('Destroying Bookings:');
    this.bookings = [];
  }

  ngOnDestroy() {
    console.log('Destroying Bookings:');
    this.bookings = [];
  }

}
