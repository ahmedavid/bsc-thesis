import { Component, ViewChild, OnInit } from '@angular/core';
import { ChatService } from 'src/app/_services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { ModalController, AlertController, IonContent, IonInput } from '@ionic/angular';
import { RtcService } from 'src/app/_services/rtc.service';
import { CallModalComponent } from './call-modal/call-modal.component';
import { Message } from 'src/app/models/models';

@Component({
  selector: 'app-consultation-tab',
  templateUrl: './consultation-tab.component.html',
  styleUrls: ['./consultation-tab.component.scss'],
})
export class ConsultationTabComponent implements OnInit {

  message = '';
  conversation = {
    messages:[]
  };
  bookingId;
  bookeeId;
  bookerId;
  peer;

  @ViewChild('messageInput', {static: false}) messageInput: IonInput;
  @ViewChild('content', {static: false}) content: IonContent;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private rtcService: RtcService
    ) { }

  ngOnInit() {

    console.log('HISTORY: ',history.state,this.router.getCurrentNavigation())
    

    this.route.paramMap.subscribe((params) => {
      this.bookingId = +params.get('bookingId');
      this.bookeeId = +params.get('bookeeId');
      this.bookerId = +params.get('bookerId');
      if(this.bookingId <= 0) {
        this.handleNonActiveConsultation();
      } else {

        //this.chatService.joinMainRoom();
      }
    });

    this.peer={};
    if(this.authService.user.id === this.bookeeId){
      // Local user is doctor,set peer doctor
      this.peer['id'] = this.bookeeId;
    }
    if(this.authService.user.id === this.bookerId){
      // Local user is patient,set peer patient
      this.peer['id'] = this.bookeeId;
    }

    this.chatService.usersObservable.subscribe(users=> {
      let peer={};
      if(this.authService.user.id === this.bookeeId){
        // Local user is doctor,set peer doctor
        peer = this.chatService.users.find(u => u.id === this.bookerId);
      }
      if(this.authService.user.id === this.bookerId){
        // Local user is patient,set peer patient
        peer = this.chatService.users.find(u => u.id === this.bookeeId);
      }
      if(peer){
        this.peer = peer;
        this.chatService.joinRoom(this.bookingId,this.authService.user,peer);
      }
    })

    this.chatService.currentConversation.subscribe(() => {
      this.conversation = this.chatService.getConversation(this.peer.id);
      console.log('GOT CONVERSATON:',this.conversation)
      this.content.scrollToBottom(300);
    })

  }

    /**
   * If There is no current active consultation session alert user and navigate to mybookings tab
   */
  handleNonActiveConsultation = () => {
    this.alertCtrl.create({
      message: 'Please select a consultation from bookings tab',
      buttons:[
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    })
    .then(alert => {
      alert.present();
      alert.onDidDismiss().then(() => this.router.navigate(['/menu/tabs/mybookings']));
    })
    .catch(err => console.log('Alert Error:',err));
  }

  ionViewWillEnter() {
      //this.chatService.activate(this.peer.id);
  }

  ionViewWillLeave() {
    //this.chatService.conversation.active = false;
  }

  getTextAlignment(message): 'ion-padding text-right bg-dark' | 'ion-padding text-left bg-light' {
    if (message.sender.id === +this.authService.decodedToken.nameid) {
      return 'ion-padding text-right bg-dark';
    }
    return 'ion-padding text-left bg-light';
  }

  getTime(timestamp) {
    const date = new Date(timestamp);
    return date.getHours() + ':' + date.getMinutes();
  } 

  sendMessage() {
    if (this.message && this.message.length > 0) {
      const newMessage:Message = {
        text:this.message,
        timestamp: new Date(),
        sender:this.authService.user,
        receiver: this.peer
      } 
      this.chatService.sendMessage(newMessage,this.bookingId);
      this.message = '';
      this.content.scrollToBottom(300);
      this.messageInput.setFocus();
    }
  }

  async startCall() {
    const newMessage: Message = {
      sender: this.authService.user,
      receiver: this.peer,
      text: 'STARTING VIDEO',
      timestamp: new Date()
    };
    this.chatService.sendMessage(newMessage,this.bookingId);
    const modal = await this.modalCtrl.create({
            component: CallModalComponent,
            componentProps: {
            peer:this.peer,
            roomId:this.bookingId
        },
        backdropDismiss:false
    });        
    modal.present();  
  }
}
