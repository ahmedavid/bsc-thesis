import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { BookingService } from 'src/app/_services/booking.service';
import * as moment from 'moment';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss'],
})
export class DoctorDetailComponent implements OnInit {


  doctor;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private bookingSerice: BookingService,
    ) { }

  calendar = {
    mode: 'week',
    currentDate: null
  };

  // event = {
  //   title: 'test',
  //   desc: 'test desc',
  //   startTime: new Date("2019-10-28T10:00:00"),
  //   endTime: new Date("2019-10-28T11:00:00"),
  //   allDay: false
  // };
  eventSource = [];


  
  ngOnInit() {

    this.route.data.subscribe(data => {
      this.doctor = data.doctor;
      this.bookingSerice.getBookingsByBookeeId(this.doctor.id).subscribe(
        (bookings: any[]) => {
          console.log("BOOKINGS: ", bookings)
          this.eventSource = bookings.map(b => {
            console.log("START TIME:",new Date(b.startTime).toLocaleTimeString(),)
            return {
              bookingId: b.id,
              title: b.booker.fullname,
              desc: '',
              startTime: moment.utc(b.startTime).toDate(),
              endTime: moment.utc(b.endTime).toDate(),
              allDay: false
            };
          });
        }
      );
    });

  }
  reloadSource(startTime, endTime) {}
  
  onEventSelected(event) {
    console.log('Event Selected:' ,event)
  }

  onViewTitleChanged(event) {}

  async onTimeSelected(event) {
    console.log('Time Selected:' ,event)
    if (event.events && event.events.length === 0) {
      const now = moment();
      const selTime = moment(event.selectedTime);
      const nextTime = moment(event.selectedTime).startOf('hour').add(1, 'hour');
      const st = moment(event.selectedTime).startOf('hour');
      const en = moment(event.selectedTime).add(1, 'hour').startOf('hour');
      if ( now.isBetween(st, en) || selTime.isAfter(now)) {
        console.log('Can book')
        const props = {
          subject: this.authService.decodedToken.given_name + ' consults with ' + this.doctor.fullname,
          bookerId: +this.authService.decodedToken.nameid,
          bookeeId: this.doctor.id,
          startTime: new Date(event.selectedTime),
          endTime: moment(event.selectedTime).add(1, 'h').toDate()
        };
        const modal = await this.modalCtrl.create({
          component: BookingFormComponent,
          componentProps: props
        });
        modal.present();
        modal.onDidDismiss().then(() => {
          this.bookingSerice.getBookingsByBookeeId(this.doctor.id).subscribe(
            (bookings: any[]) => {
              this.eventSource = bookings.map(b => {
                return {
                  title: b.booker.fullname,
                  desc: '',
                  startTime: moment.utc(b.startTime).toDate(),
                  endTime: moment.utc(b.endTime).toDate(),
                  allDay: false
                };
              });
            }
          );
        });
      } else {
        console.log('cant book past time')
        const toast = await this.toastCtrl.create({message: 'Can\'t Book Past Time', duration: 1000});
        toast.present();
      }
    } else {
      this.toastCtrl.create({message: 'Cant book this time', duration: 800, color: 'warning'}).then(toast => toast.present());
    }
  }

  onCurrentDateChanged(evt) {
    console.log("Current Date Changed: ",evt)
  }
}
