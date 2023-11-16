import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BookingService } from 'src/app/_services/booking.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {

  @Input() startTime: Date;
  @Input() endTime: Date;
  @Input() subject;
  @Input() bookerId;
  @Input() bookeeId;
  scheduleForm = new FormGroup({
    subject: new FormControl(this.subject, Validators.required),
    description: new FormControl('', Validators.required),
    startTime: new FormControl({value: this.startTime, disabled: true}, Validators.required),
    endTime: new FormControl({value: this.endTime, disabled: true}, Validators.required),
  });


  constructor(private modalCtrl: ModalController, private bookingService: BookingService) { }

  ngOnInit() {
    console.log("START: ",this.startTime)
    console.log("END: ",this.endTime)
    this.scheduleForm.reset({
      subject: this.subject,
      description: '',
      startTime: new Date(this.startTime).toTimeString(),
      endTime: new Date(this.endTime).toTimeString()
    });
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  onSchedule(ev) {
    ev.preventDefault();
    const newBooking = {
      bookerId: this.bookerId,
      bookeeId: this.bookeeId,
      startTime: this.startTime.toJSON(),
      endTime: this.endTime.toJSON(),
      description: this.scheduleForm.value.description
    };
    console.log(newBooking)
    this.bookingService.makeBooking(newBooking).subscribe(
      booking => {
        this.onClose();
      }
    );
  }
}
