import { Component } from '@angular/core';
import { faUserMd, faCalendarAlt, faVideo } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth.service';
import { ChatService } from '../_services/chat.service';
import { RtcService } from '../_services/rtc.service';
import { ModalController } from '@ionic/angular';
import { AnswerModalComponent } from './consultation-tab/answer-modal/answer-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  faUserMd = faUserMd;
  faCalendarAlt = faCalendarAlt;
  faVideo = faVideo;

  patientTabs = [
    {
      title: 'Doctors',
      url: 'doctors',
      icon: faUserMd
    },
    {
      title: 'Bookings',
      url: 'mybookings',
      icon: faCalendarAlt
    },
    {
      title: 'Consultation',
      url: 'consultation',
      icon: faVideo
    },
  ];
  doctorTabs = [
    {
      title: 'Bookings',
      url: 'mybookings',
      icon: faCalendarAlt
    },
    {
      title: 'Consultation',
      url: 'consultation',
      icon: faVideo
    },
  ];
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private rtcService: RtcService,
    private modalCtrl: ModalController
    ) {
    console.log('TABS PAGE LOADED')

    chatService.joinMainRoom();
    this.rtcService.gettingCallObservable.subscribe(({track,caller}) => {
      console.log('GETTING A CALL FROM : ',caller);
      if(!this.rtcService.callActive) {
        this.rtcService.callActive = true;
        this.modalCtrl.create({
          component: AnswerModalComponent,
          componentProps:{
            caller,
            track
          },
          backdropDismiss:false
        }).then(modal => {
          modal.present()
        })
      }
    })

  }
  
  getTabs() {
    if (this.authService.decodedToken.role === "True") {
      return this.doctorTabs;
    } 
    return this.patientTabs;
  }

}
