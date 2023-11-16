// import { Component, OnInit, ViewChild } from '@angular/core';
// import { ChatService } from '../../_services/chat.service';
// import { SocketService } from 'src/app/_services/socket.service';
// import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
// import { AlertController, IonInput } from '@ionic/angular';
// import { ConnectionStatus } from 'src/app/models/models';

// @Component({
//   selector: 'app-consultation-tab',
//   templateUrl: './consultation-tab.component.html',
//   styleUrls: ['./consultation-tab.component.scss'],
// })
// export class ConsultationTabComponent implements OnInit {
//   @ViewChild('messageInput', {static: false}) messageInput: IonInput;
//   @ViewChild('chatContainer', {static: false}) chatContainer: HTMLElement;
//   bookingId = -1;
//   message = '';
//   messages = [
//     {
//       text: 'Salam',
//       timestamp: new Date().getTime()
//     },
//     {
//       text: 'Nevar neyox',
//       timestamp: new Date().getTime()
//     },
//     {
//       text: 'Salam',
//       timestamp: new Date().getTime()
//     }
//   ]

//   doctor: {given_name: 'Offline',status: ConnectionStatus.Offline};
//   patient:{given_name: 'Offline',status: ConnectionStatus.Offline};

//   constructor(
//     private chatService: ChatService,
//     private route:ActivatedRoute,
//     private router: Router,
//     private alertCtrl: AlertController
//    ) { }

//   ngOnInit() {
//     this.route.paramMap.subscribe((params) => {
//       this.bookingId = +params.get('bookingId');
//       if(this.bookingId <= 0) {
//         this.handleNonActiveConsultation();
//       } else {
//         this.chatService.joinRoom(this.bookingId);
//       }
//       console.log('Consultation Booking ID:', this.bookingId)
//     });

//     this.chatService.reconnectObservable.subscribe(number => {
//       console.log('RECONNECTED IN CONSULTATION:',number);
//       this.chatService.joinRoom(this.bookingId);
//     })

//     this.chatService.roomObservable.subscribe(room => {
//       console.log('ROOM:',room);
//       this.patient = room.patient ? {...room.patient,status:ConnectionStatus.Online} : {given_name: 'Offline',status:ConnectionStatus.Offline};
//       this.doctor = room.doctor ? {...room.doctor,status:ConnectionStatus.Online} : {given_name: 'Offline',status:ConnectionStatus.Offline};
//     })
//   }

//   /**
//    * If There is no current active consultation session alert user and navigate to mybookings tab
//    */
//   handleNonActiveConsultation = () => {
//     this.alertCtrl.create({
//       message: 'Please select a consultation from bookings tab',
//       buttons:[
//         {
//           text: 'OK',
//           role: 'cancel'
//         }
//       ]
//     })
//     .then(alert => {
//       alert.present();
//       alert.onDidDismiss().then(() => this.router.navigate(['/menu/tabs/mybookings']));
//     })
//     .catch(err => console.log('Alert Error:',err));
//   }

//   sendMessage() {
//     if (this.message && this.message.length > 0) {
//       //this.chatService.sendMessage(newMessage);
//       this.messages.push({text:this.message,timestamp:new Date().getTime()})
//       this.message = '';
//       this.messageInput.setFocus();
//     }
//   }

//   getTime(timestamp) {
//     const date = new Date(timestamp);
//     return date.getHours() + ':' + date.getMinutes();
//   } 

// }
