import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, Conversation, Message } from '../models/models';
import { map } from 'rxjs/operators';

/**
 * Service manages SocketIO connection with signalig server (NodeJS+SocketIO Server)
 */
@Injectable({providedIn: 'root'})
export class SocketService {
  public usersObservable: Observable<User[]>;
  public peerLeftObservable: Observable<User>;
  public getMessageObservable: Observable<{roomId: number, message: Message}>;
  public getOfferObservable: Observable<{caller:User,offerString:string}>;
  public getAnswerObservable: Observable<{roomId:number,data:string}>;
  public iceCandidateObservable: Observable<RTCIceCandidate>;
  public stopObservable: Observable<string>;

  constructor(private socket: Socket, private authService: AuthService) {
    this.init();
}
  /**
   * Register socket io events in order to receive messages from socket server
   */
  init() {
    this.socket.fromEvent('user_connected').subscribe((data: {socketId:string}) => this.authService.updateSocketId(data.socketId) );
    this.iceCandidateObservable = this.socket.fromEvent<RTCIceCandidate>('icecandidate');
    this.getMessageObservable = this.socket.fromEvent('get_message');
    this.stopObservable = this.socket.fromEvent('stop');
    this.peerLeftObservable = this.socket.fromEvent('peer_left');
    this.getOfferObservable = this.socket.fromEvent('offer');
    this.getAnswerObservable = this.socket.fromEvent('answer');
    this.usersObservable = this.socket.fromEvent('users_list')
    .pipe(
        map((usersString: string) => {
            const users: User[] = JSON.parse(usersString);
            const filtered = users.filter(u => u.id !== this.authService.user.id);
            return filtered;
        })
    );

    this.socket.on('disconnect', reason => this.handleDisconnect(reason));
    this.socket.on('reconnect', data => this.handleReconnect(data));

    this.socket.on('test', data => console.log('TEST : ',data))
    this.socket.on('test_room', data => console.log('TEST_ROOM : ',data))
  }

  /**
   * Socket automaticly connects to socket server
   * In this context reconnect means to rejoin to main room
   */
  handleReconnect = data => {
    console.log('Reconnected: ',data);
    this.connect();
  }

  handleDisconnect = reason =>{}

  /**
   * Join to main room
   */
  connect() {
    if (this.authService.user) {
        this.socket.emit('join_main_room', this.authService.user);
    }
  }

  /**Join the socket to specified room */
  joinRoom(roomId,caller,callee){
    this.socket.emit('join_room',{roomId,caller,callee});
  }

  /**Sends text messages to remote peer in specified roomId */
  sendMessage(message: Message,roomId:number) {
      this.socket.emit('send_message',{message,roomId});
  }

  /**Sends SDP offer message to remote RTC*/
  sendOffer(roomId:number,caller:User,data:string) {
    this.socket.emit('offer',{roomId,caller,data});
  }

  /**Sends SDP answer message to remote RTC*/
  sendAnswer(roomId,data) {
    this.socket.emit('answer',{roomId,data});
  }

  /**Sends ICE candidates to remote RTC*/
  sendIceCandidate(roomId:number,candidate: RTCIceCandidate) {
    this.socket.emit('icecandidate', {roomId,candidate});
  }

  /**Send 'STOP' signal in order to terminate a call */
  sendStop(roomId:number) {
    this.socket.emit('stop', {roomId});
  }
}
