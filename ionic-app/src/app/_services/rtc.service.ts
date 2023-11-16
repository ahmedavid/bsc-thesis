import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { User } from '../models/models';
import { AuthService } from './auth.service';
import { ToastController, AlertController } from '@ionic/angular';
import { AudioService } from './audio.service';

/**Define wich media will be captured from user device */
const constraints = {audio:true,video:true}

/**Use Googles' public STUN server for testing */
const stunConfig = {
    iceServers: [
        {
            urls: 'stun:stun.stunprotocol.org'
        }
    ]
};

/**
 * Service responsible for establishing and maintaining WebRTC Session.
 *
 */
@Injectable({providedIn: 'root'})
export class RtcService {
    /**Represents WebRTC connection object */
    rtc: RTCPeerConnection;
    /**Holds audio and video stream that was captured from webcam and microphone */
    localStream: MediaStream;
    /**Observable Subject that notifies ui element when local MediaStream is available */
    public localStreamSubject: Subject<MediaStream> = new Subject<MediaStream>();
    /**Observable Subject that notifies ui element when remote MediaStream is available */
    public remoteStreamSubject: Subject<MediaStream> = new Subject<MediaStream>();
    /**Notifies main page if app is receiving a call from remote peer */
    gettingCallObservable: Subject<any> = new Subject<any>();
    /**Observable that opens a video call user interface when receiving a call from remote peer */
    openAnswerModalObservable: Subject<{roomId:number}> = new Subject<any>();
    /**
     * Terminates current RTC session if 'STOP' signal received from remote peer.
     * Remote peer might press end call button or just disconnect
     * */
    stopObservable: Observable<string>;
    currentRoomId: number;
    currentCaller: User;
    /**If we are receiving the call we are remote end */
    isRemote = false;
    /**If call is active */
    public callActive = false;
    /**Buffer IceCandidates received from remote peer */
    receivedIceCandidadates = [];
    /**Toast UI element that allows user to accept or decline a call */
    callToast:HTMLIonToastElement;

    constructor(
        private socketService: SocketService,
        private authService: AuthService,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private audioService: AudioService
        ){
        this.socketService.iceCandidateObservable.subscribe(this.handleNewIceCandidate);
        this.socketService.getOfferObservable.subscribe(data => this.handleOffer(data));
        this.socketService.getAnswerObservable.subscribe(data => this.handleAnswer(data));
        this.stopObservable = this.socketService.stopObservable;
        /**If we receive 'STOP' signal from remote peer, stop ringing audio and dismiss toast UI */
        this.stopObservable.subscribe(() => {
            if(this.callToast) {
                this.audioService.stop();
                this.callToast.dismiss();
            }
        });
    }
    /**Initialize local rtc object and add necessary event listeners */
    init() {
        if(!this.rtc) {
            this.rtc = new RTCPeerConnection(stunConfig);
            this.rtc.addEventListener('negotiationneeded',this.handleNegotiationNeeded);
            this.rtc.addEventListener('icecandidate', this.handleIceCandidate);
            this.rtc.addEventListener('track', this.handleTrack);
            this.rtc.addEventListener('iceconnectionstatechange', this.handleIceConnectionStateChange);
            this.rtc.addEventListener('signalingstatechange', this.handleSignalingStateChange);
        }
    }

    /**Access device camera and microphone, This triggers negotiation needed event. Deliver audio video stream to UI*/
    async startSignalling(roomId: number) {
        try {
            this.currentRoomId = roomId;
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.localStream.getTracks().forEach(track => this.rtc.addTrack(track, this.localStream));
            console.log('Tracks added , negoneeded event should fire')
            this.callActive = true;
    
            this.localStreamSubject.next(this.localStream);
            
        } catch (error) {
            this.showErrorAlert("Error Accessing User Media Source");
            throw new Error(error);
        }
    }

    /**
     * Release local camera and microphone resources
     */
    stopLocalStream() {
        if(this.localStream){
            this.localStream.getTracks().forEach(t => t.stop());
            this.localStream = undefined;
            this.callActive = false;
            this.destroy();
        }
    }

    /**Create a SPD offer message and send it to remote peer */
    handleNegotiationNeeded = async (evt) => {
        try {
            if(!this.isRemote) {
                const offer = await this.rtc.createOffer();
                this.rtc.setLocalDescription(offer);
                // Send Offer
                this.socketService.sendOffer(this.currentRoomId,this.authService.user,JSON.stringify(offer));

            }
        } catch (error) {
            console.log('OFFER ERROR: ', error)            
        }
    }

    /**
     * Helper method to send 'STOP' signal in order to terminate current call session
     * @param roomId 
     */
    sendStop(roomId) {
        this.socketService.sendStop(roomId);
    }

    /**
     * If user presses 'Decline' button , call request is refused
     */
    handleDeclineCall = (roomId:number) => {
        this.audioService.stop();
        this.isRemote = false;
        this.socketService.sendStop(roomId);
        this.callToast.dismiss();
    }

    /**
     * If user wants to accept the call request, remote peers offer is parsed an assigned as remoteDescription 
     * If offer is parsed successfuly answer SDP message is generated and is sent to remote peer.
     * This also accesses local audio and video resources
     * */
    handleAnswerCall = async (roomId,offer,caller) => {
        console.log('ANSWERING THE CALL')
        this.isRemote = true;
        this.init();
        this.audioService.stop();
        if(offer) {
            this.currentCaller = caller;
            await this.rtc.setRemoteDescription(offer)
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.localStream.getTracks().forEach(track => this.rtc.addTrack(track, this.localStream));
            this.localStreamSubject.next(this.localStream)
            const answer = await this.rtc.createAnswer();
            await this.rtc.setLocalDescription(answer);

            /**Add buffered ICE candidates to RTC object */
            this.receivedIceCandidadates.forEach(c => this.rtc.addIceCandidate(c));
            this.receivedIceCandidadates = [];
            this.callToast.dismiss();
            this.callActive = true;

            this.socketService.sendAnswer(roomId,JSON.stringify(answer));
            /**Trigger to open Call answer UI */
            this.openAnswerModalObservable.next({roomId})

        }
    }

    /**
     * If we received an SPD offer from calling side , present a UI that user can 'Decline' or 'Answer' the call
     */
    handleOffer = async (data) => {
        console.log('GETTING AN OFFER!!!!!!!:')
        try {
            const offer:RTCSessionDescription = JSON.parse(data.data);
            this.audioService.play('ring',true)
            //this.handleAnswerCall(offer,data.caller)
            this.callToast = await this.toastCtrl.create({
                color:'success',
                message:'Receiving Call From ' + data.caller.fullname,
                buttons:[
                    {
                        text:'Decline',
                        handler: () => this.handleDeclineCall(data.roomId),
                    },
                    {
                        text:'Answer',
                        handler: () => this.handleAnswerCall(data.roomId,offer,data.caller)
                    },
                ]
            })
            this.callToast.present();

            // this.socketService.sendAnswer(this.currentRoomId,JSON.stringify(answer));
        } catch (error) {
            console.log('OFFER HANDLE ERROR:', error)
        }
    }

    /**Parse Answer SDP message and assign it to remoteDescription */
    handleAnswer = async ({roomId,data}) => {
        try {
            console.log('GOT ANSWER FROM REMOTE')
            const answer = JSON.parse(data);
            await this.rtc.setRemoteDescription(answer);
            
        } catch (error) {
            console.log('ANWER HANDLE ERROR:', error)
        }
    }

    /**
     * Process and add received ICE Candidates to RTC object
     */
    private handleNewIceCandidate = (candidate) => {
        if(!this.rtc){
            if (candidate && candidate.candidate) {
                this.receivedIceCandidadates.push(candidate);
            }
        }
      }

    /**RTC object generated and ICE candidate, relay it to the peer */
    handleIceCandidate = async (evt) => {
        this.socketService.sendIceCandidate(this.currentRoomId,evt.candidate);
    }

    /**
     * This is fired when we received audio and video tracks from remote.
     * Means that we are ready to display remote peers audio and video
     *  */
    handleTrack = async (evt) => {
        if(this.isRemote){
            //this.remoteStreamSubject.next(evt.streams[0]);
            this.gettingCallObservable.next({track:evt,caller:this.currentCaller});
        } else {
            this.remoteStreamSubject.next(evt.streams[0])
        }
    }

    /**Monitor Ice connection state (FOR DEBUGGING) */
    private handleIceConnectionStateChange(event) {
        //console.log("ICE CONN CHANGE: ",event)
    }
    /**Monitor Ice signaling state (FOR DEBUGGING) */
    private handleSignalingStateChange(event) {
    //console.log("SIGNALING CHANGE: ",event)
    }

    /**
     * If call is terminated release RTC object and remove all listeners.
     */
    destroy() {
        this.rtc.removeEventListener('negotiationneeded',()=>{});
        this.rtc.removeEventListener('icecandidate',()=>{});
        this.rtc.removeEventListener('track',()=>{});
        this.rtc.removeEventListener('iceconnectionstatechange',()=>{});
        this.rtc.removeEventListener('signalingstatechange',()=>{});
        this.rtc = undefined;
        this.isRemote = false;
    }

    showErrorAlert(message:string) {
        this.alertCtrl.create({
            message,
            buttons:[
                {
                    text:'OK',
                    role: 'cancel'
                }
            ]
        }).then(alert => alert.present())
    }
}