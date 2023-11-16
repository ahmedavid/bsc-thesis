import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { User } from 'src/app/models/models';
import { AudioService } from 'src/app/_services/audio.service';
import { ModalController } from '@ionic/angular';
import { RtcService } from 'src/app/_services/rtc.service';
import { ChatService } from 'src/app/_services/chat.service';

@Component({
  selector: 'app-answer-modal',
  templateUrl: './answer-modal.component.html',
  styleUrls: ['./answer-modal.component.scss'],
})
export class AnswerModalComponent implements OnInit {

  seconds = 0;
  interval;
  timeString = '';
  constructor(
    private modalCtrl: ModalController,
    private audioService: AudioService,
    private rtcService: RtcService,
    private chatService: ChatService
    ) { }

  @ViewChild('localVideo',{static: false}) localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo',{static: false}) remoteVideo: ElementRef<HTMLVideoElement>;
  @Input() caller:User;
  roomId:number;
  @Input() track:RTCTrackEvent;

  ionViewDidEnter() {
      const st = this.track.streams[0]
      this.remoteVideo.nativeElement.srcObject = st
      this.rtcService.callActive = true;

  }

  ngOnInit() {
    const convo = this.chatService.conversations.find(c => c.remote.id === this.caller.id);
    if(convo){
      this.roomId = convo.roomId;
    }
    this.rtcService.localStreamSubject.subscribe(stream => {
      this.localVideo.nativeElement.muted = true;
      this.localVideo.nativeElement.srcObject = stream;
      this.startTimer();
    });
    this.rtcService.stopObservable.subscribe(() => {
      if(this.rtcService.callActive) {
        this.endCall();
      }
    })
  }

  endCall() {
    this.stopTimer();
    this.localVideo.nativeElement.srcObject = null;
    this.remoteVideo.nativeElement.srcObject = null;
    this.audioService.stop();
    this.rtcService.sendStop(this.roomId);

    this.modalCtrl.dismiss();
    this.rtcService.stopLocalStream();
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
