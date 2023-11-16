import * as express from 'express';
import * as socketio from 'socket.io';
import {MessageType} from '../../ionic-app/src/app/models/models';
import { SocketHandler } from './socket-handler';
const app = express();

/**
 * Get Port from environment or default to Port 3000
 */
const PORT = process.env.PORT || 3000;

/**
 * Start Express Server on PORT
 */
const server = app.listen(PORT,()=>{
    console.log('Signaling Server Running on Port: ' + PORT);
});

const rooms = [];
setInterval(() => {
    console.log('Rooms: ',rooms);
} ,25000)

/**
 * Initialize SoketIO instance
 */
const io = socketio.listen(server);
let handlers:SocketHandler[] = [];

// setInterval(()=>{
//     console.log('Handlers: ', handlers)
// },5000)

/**
 * Set up listener for socket connections
 */
io.on('connect',socket => {
    console.log('User connected with socket: ',socket.id);
    new SocketHandler(io,socket,rooms,deleteHandler);
    //handlers.push(handler);
});


function deleteHandler(socket:socketio.Socket) {
    // let handler = handlers.find(h => h.socket.id === socket.id);
    // if(handler) {
    //     handlers = handlers.filter(h => h !== handler);
    //     handler.socket = undefined;
    //     handler = undefined;
    // }
}