import { Socket } from "socket.io";
import { USER_CONNECTED, DISCONNECT, JOIN_ROOM,ONLINE_USERS, SEND_MESSAGE, GET_MESSAGE, OFFER, ANSWER, ICE_CANDIDATE, STOP } from "../../shared/constants";



export class SocketHandler {
    constructor(private io:SocketIO.Server,public socket:Socket,private rooms:any[],private disconnectCallback:(socket:SocketIO.Socket)=>void){
        socket.emit(USER_CONNECTED,{socketId:socket.id});

        socket.on(DISCONNECT, (reason:string) => this.handleDisconnect(reason));
        socket.on(JOIN_ROOM, (data) => this.handleJoinRoom(data));
        socket.on(SEND_MESSAGE, (data) => this.handleSendMessage(data));
        socket.on(OFFER, (data) => this.handleOffer(data));
        socket.on(ANSWER, (data) => this.handleAnswer(data));
        socket.on(ICE_CANDIDATE, (data) => this.handleIceCandidate(data));
        socket.on(STOP, (data) => this.handleStop(data));


    }

    handleOffer = ({roomId,offer,peer}) => {
        console.log('RELAY OFFER:', roomId)
        this.socket.in(roomId).emit(OFFER,{offer,caller:peer});
    }
    handleAnswer = ({roomId,answer}) => {
        this.socket.in(roomId).emit(ANSWER,answer);
    }
    handleIceCandidate = ({roomId,candidate}) => {
        console.log('RELAY ICE:',candidate)
        this.socket.in(roomId).emit(ICE_CANDIDATE,candidate);
    }
    handleStop = ({roomId}) => {
        console.log('STOP CALL:', roomId)
        this.socket.in(roomId).emit(STOP);
    }

    handleSendMessage = (data) => {
        console.log('RELAY MESSAGE:',data)
        this.socket.in(data.roomId).emit(GET_MESSAGE,data);
    }

    handleDisconnect = (reason:string) => {
        console.log('User disconnected: ',reason)
        let foundRoomIndex = -1;
        this.rooms.forEach((room,index) => {
            if(room.patient && room.patient.socketId === this.socket.id) {
                // patient left room
                room.patient = undefined;
                this.io.in(room.bookingId).emit(ONLINE_USERS,room);
                this.disconnectCallback(this.socket);
            }
            if(room.doctor && room.doctor.socketId === this.socket.id) {
                //doctor left room
                room.doctor = undefined;
                this.io.in(room.bookingId).emit(ONLINE_USERS,room);
                this.disconnectCallback(this.socket);
            }
            if(!room.patient && !room.doctor) {
                // both doctor and patient left the room, mark room for deletion
                foundRoomIndex = index;
            }
        });
        if(foundRoomIndex >= 0) {
            const removed = this.rooms.splice(foundRoomIndex,1);
            console.log('ROOM REMOVED:' ,removed)
        }
    }

    handleJoinRoom = ({user,bookingId}) => {
        user.socketId = this.socket.id;
        const existingRoom = this.rooms.find(r => r.bookingId === bookingId);
        if(!existingRoom) {
            // Consultation room does't exist yet , make a new room
            let newRoom;
            if(user.role === "True"){
                // User is doctor
                newRoom = {
                    bookingId,
                    doctor:user
                }
            } else if(user.role === "False") {
                // User is patient
                newRoom = {
                    bookingId,
                    patient:user
                }
            } else {
                throw new Error('Room Assign ERROR!!!!!!!!')
            }
            this.socket.join(bookingId);
            this.rooms.push(newRoom);
            this.io.in(bookingId).emit(ONLINE_USERS,newRoom);
        } else {
            // Consultation room already exists, add the user to the correct slot (patient or doctor)
            if(user.role === "True"){
                // User is doctor, assign to doctor slot
                existingRoom.doctor = user;
            } else if(user.role === "False") {
                // User is patient, assign to patient slot
                existingRoom.patient = user;
            } else {
                throw new Error('Room Assign ERROR!!!!!!!!')
            }
            this.socket.join(bookingId);
            this.io.in(bookingId).emit(ONLINE_USERS,existingRoom);
        }        
    }
}