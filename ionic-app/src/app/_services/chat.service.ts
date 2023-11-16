import { Injectable } from '@angular/core';
import { Conversation, User, Message } from '../models/models';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
import { Subject, Observable,BehaviorSubject } from 'rxjs';
import { AudioService } from './audio.service';


/**
 * Service is responsible to send text messages to and from SocketIO server
 * Maintains currently active conversation threads.
 * Maintains currently active users in the chat room
 */
@Injectable({providedIn: 'root'})
export class ChatService {

  conversations: Conversation[] = [];
  public currentConversation: Subject<boolean>;
  public usersObservable: BehaviorSubject<User[]>;
  timesCalled = 0

  users: User[] = [];

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private audioService: AudioService
    ) {
    this.currentConversation = new Subject<boolean>();
    socketService.usersObservable.subscribe(users => {
      this.users = users
      if(!this.usersObservable){
        this.usersObservable = new BehaviorSubject(users);
      } else {
        this.usersObservable.next(users);
      }
    });
    socketService.getMessageObservable.subscribe(data => this.receiveMessage(data));
    socketService.peerLeftObservable.subscribe(user => {
      const convo = this.conversations.find(c => c.remote.id === user.id);
      if(convo) {
        convo.active = false;
      }
    })
  }

  /**Every user is automaticly joined to common room */
  joinMainRoom(){
    this.socketService.connect();
  }

  /**If Doctor and Patient want to send message to each other, they are joined to a private room
   * Room Id is same as booking Id.
   */
  joinRoom(roomId,caller,callee){
    this.socketService.joinRoom(roomId,caller,callee);
  }

  /**
   * Event handler for getMessageObservable.
   * Received messages are kept in appropriate conversation thread.
   */
  receiveMessage = ({roomId, message}: {roomId: number, message: Message}) => {
    let conversation = this.conversations.find(c => c.roomId === roomId);
    if(!conversation) {
      // If conversation doesn't exist initialize and push conversation
      conversation = this.initConversation(roomId,message.receiver,message.sender,false);
      this.conversations.push(conversation);
    }
    // Push received message to the conversation
    if(conversation.active) {
      conversation.messages.push(message);
      this.currentConversation.next(true);
    } else {
      conversation.messages.push(message);
      this.currentConversation.next(true);
      //conversation.unread.push(message);
    }
    this.audioService.play('message');
    console.log('Message Received: ', conversation)
  }

  /**
   * provides current message thread to chat UI
   * @param peerId 
   */
  getConversation(peerId: number) {
    this.timesCalled++;
    console.log('Times Called: ',this.timesCalled)
    const conversation = this.conversations.find(c => c.remote.id === peerId);
    if(conversation) {
      conversation.messages = [...conversation.messages,...conversation.unread];
      conversation.unread = [];
      return conversation;
    } else {
      const peer = this.users.find(u => u.id === peerId);
      return this.initConversation(123,this.authService.user,peer,true);
    }
  }

  /**Initializes a new chat room for new conversation session */
  initConversation(roomId,local,remote,active:boolean) {
    const newConversation:Conversation = {
      roomId,
      remote,
      local,
      active,
      messages: [],
      unread: []
    }
    return newConversation;
  }

  /**If no previous conversation exists, new conversation is initialized.
   * Otherwise push the message in the current thread and forward it to remote peer.
   */
  sendMessage(message: Message,roomId:number) {
    let conversation = this.conversations.find(c => c.roomId === roomId);
    if (!conversation) {
      conversation = this.initConversation(roomId,message.sender,message.receiver,true);
      conversation.messages.push(message);
      this.conversations.push(conversation);
    } else {
      conversation.messages.push(message);
    }
    this.currentConversation.next(true);
    this.socketService.sendMessage(message,roomId);
  }

  /**If user enters chat page mark conversation as active, so that new messages are pushed to messages array */
  activate(peerId: number) {
    const conversation = this.conversations.find(c => c.remote.id === peerId);
    if(conversation) {
      conversation.active = true;
    }
  } 

  /**If user leaves chat page, mark conversation as inactive , so that messages are pushed to unread array */
  deactivate(peerId: number) {
    const conversation = this.conversations.find(c => c.remote.id === peerId);
    if(conversation) {
      conversation.active = false;
    }
  } 

  /**Helper method for UI to show how many unread messages user has */
  getUnread(peerId:number) {
    const conversation = this.conversations.find(c => c.remote.id === peerId);
    if(conversation) {
      return conversation.unread.length;
    }
    return 0;
  }
}
