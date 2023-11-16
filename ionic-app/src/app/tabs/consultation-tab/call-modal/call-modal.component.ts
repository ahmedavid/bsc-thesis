import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthUser } from 'src/app/models/models';
import { AudioService } from 'src/app/_services/audio.service';
import { RtcService } from 'src/app/_services/rtc.service';

@Component({
  selector: 'app-call-modal',
  templateUrl: './call-modal.component.html',
  styleUrls: ['./call-modal.component.scss'],
})
export class CallModalComponent implements OnInit {

  seconds = 0;
  interval;
  timeString = '';

  constructor(
    private modalCtrl: ModalController,
    private rtcService: RtcService,
    private audioService: AudioService
    ) { }

  @ViewChild('localVideo',{static: false}) localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo',{static: false}) remoteVideo: ElementRef<HTMLVideoElement>;
  @Input() peer:AuthUser;
  @Input() roomId:number;

  ngOnInit() {
    this.rtcService.localStreamSubject.subscribe(stream => {
      this.localVideo.nativeElement.muted = true;
      this.localVideo.nativeElement.srcObject = stream;
      this.startTimer();
    });
    this.rtcService.remoteStreamSubject.subscribe(stream => {
      this.remoteVideo.nativeElement.srcObject = stream;
      this.audioService.stop();
      this.rtcService.callActive = true;
    });

    this.rtcService.stopObservable.subscribe(() => {
      if(this.rtcService.callActive) {
        this.endCall();
      }
    })

    this.rtcService.init();
    this.rtcService.startSignalling(this.roomId);
    this.audioService.play('local_ring',true);
  }

  endCall() {
    this.stopTimer();
    this.localVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = null;
    this.audioService.stop();
    this.rtcService.sendStop(this.roomId);
    this.rtcService.stopLocalStream();

    this.modalCtrl.dismiss();
  }

  startTimer() {
    this.interval = setInterval(()=>{
      this.seconds += 1;
      this.getTime();
    },1000)
  }
  stopTimer() {
    clearInterval(this.interval);
    this.seconds = 0;
  }

  getTime() {
    let hoursStr = '';
    let minutesStr = '';
    let secondsStr = '';
    let sec_num = this.seconds
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hoursStr   = "0"+hours;}
    else {hoursStr   = ''+hours;}
    if (minutes < 10) {minutesStr = "0"+minutes;}
    else {minutesStr   = ''+minutes;}
    if (seconds < 10) {secondsStr = "0"+seconds;}
    else {secondsStr   = ''+seconds;}
    this.timeString =  hoursStr+':'+minutesStr+':'+secondsStr;
  }
}
