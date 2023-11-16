import * as express from 'express';
import * as socketio from 'socket.io';

  interface User {
    socket?: SocketIO.Socket;
    socketId?: string;
    id: number;
    name: string;
  }
  
 interface Message {
    sender: User;
    receiver: User;
    text: string;
    timestamp: Date;
  }

const app = express();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log("Socket Server Running on PORT: " + PORT);
});
const io = socketio.listen(server)
// const io = socketio.listen(server,{
//     cookie: false, // some custom config here
//     pingTimeout: 60000,
//     pingInterval: 2000
// })
let users: User[] = [];
let rooms = [];

// setInterval(() =>{
//     console.log('Users: ',getClientsideUsers())
//     console.log('Rooms: ',rooms)

//     // users.forEach(u => {
//     //     io.to(u.socketId).emit('test','TESTING...')
//     // })

//     // rooms.forEach(r => {
//     //     io.to(r.roomId).emit('test_room','TESTING ROOM')
//     // })
// },10000)

io.on('connect',(socket) => {
    //Update user object in auth service
    console.log('User connected: ', socket.id)
    socket.emit('user_connected',{socketId:socket.id});

    socket.on('disconnect', reason => {
        let discUser;
        users = users.filter(u => {
            const isFound = u.socket.id === socket.id;
            if(isFound) {
                discUser = u;
            }
            return !isFound;
        });
        const room = rooms.find(r => {
            return r.caller.socketId === socket.id || r.callee.socketId === socket.id;
        })
        if(room) {
            const {socket,...u} = discUser;
            //socket.to(room.roomId).emit('peer_left',room)
            io.to(room.roomId).emit('peer_left',u)
            io.to(room.roomId).emit('stop')
        }
        rooms = rooms.filter(r => {
            if(r.caller.socketId === socket.id) {
                return false
            }
            if(r.callee.socketId === socket.id) {
                return false
            }
            return true;
        })
        sendUsers(socket);
    })

    socket.on('join_main_room', user => {
        socket.join('main_room',);
        console.log('User joined to MAIN ROOM: ', user)
        const us = users.find(u => u.id === user.id);
        if (!us) {
            users.push({...user,socketId:socket.id,socket, })
        }
        sendUsers(socket);
    });

    socket.on('join_room',({roomId,caller,callee})=>{
        //Join users to a private room, roomId derived from their ids
        let room = rooms.find(r => r.roomId === roomId);
        if(!room) {
            const newRoom = {
                roomId,
                caller,
                callee
            }
            rooms.push(newRoom);
        }
    })


    socket.on('send_message', ({roomId,message}) => {
        if(message.sender && message.receiver){
            const peerUser = users.find(u => u.id === message.receiver.id);
            if (peerUser) {
                peerUser.socket.join(roomId,err => {
                    if(!err) {
                        socket.join(roomId, err => {
                            if(!err) {
                                io.in(roomId).clients(c => {
                                    console.log('Clients: ',c)
                                });
                                socket.in(roomId).emit('get_message',
                                {
                                    roomId,
                                    message
                                });
                            }
                        });
                    }
                });
                
            }
        }
    })

    socket.on('offer', ({roomId,caller,data}) => {
        //console.log('RELAY OFFER: ',roomId,caller,data)
        socket.in(roomId).emit('offer',{roomId,caller,data});
    })

    socket.on('answer', ({roomId,data}) => {
        console.log('RELAY ANSWER: ')
        socket.in(roomId).emit('answer',{roomId,data});
    })
    socket.on('icecandidate', ({roomId,candidate}) => {
        socket.in(roomId).emit('icecandidate',candidate);
    })

    socket.on('stop', ({roomId}) => {
        console.log('RELAY STOP: ')
        socket.in(roomId).emit('stop',roomId);
    })
})

function sendUsers(socket: SocketIO.Socket) {
    io.to('main_room').emit('users_list', JSON.stringify(getClientsideUsers()))
}

function getClientsideUsers() {
    return users.map(u => {
        const {socket, ...user} = u;
        return user;
    });
}
