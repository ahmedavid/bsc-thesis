const express = require('express');
const app = express();
const socketio = require('socket.io');

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

/**
 * Initialize SoketIO instance
 */
const io = socketio.listen(server);

let rooms = [];

setInterval(() => {
    console.log('Rooms: ',rooms);
} ,5000)

/**
 * Set up listener for socket connections
 */
io.on('connect',socket => {
    console.log('User connected with socket: ',socket.id);
    socket.emit('user_connected',{socketId:socket.id});

    /**
     * On Socket Disconnect remove user from users array
     */
    socket.on('disconnect',reason => {
        console.log('User disconnected: ',reason)
        foundRoomIndex = -1;
        rooms.forEach((room,index) => {
            if(room.patient && room.patient.socketId === socket.id) {
                // patient left room
                room.patient = undefined;
                io.in(room.bookingId).emit('online_users',room);
            }
            if(room.doctor && room.doctor.socketId === socket.id) {
                //doctor left room
                room.doctor = undefined;
                io.in(room.bookingId).emit('online_users',room);
            }
            if(!room.patient && !room.doctor) {
                // both doctor and patient left the room, mark room for deletion
                foundRoomIndex = index;
            }
        });
        if(foundRoomIndex >= 0) {
            const removed = rooms.splice(foundRoomIndex,1);
            console.log('ROOM REMOVED:' ,removed)
        }
    })


    /**
     * Add User to appropiate slot
     */
    socket.on('join_room',({user,bookingId}) => {
        user.socketId = socket.id;
        const existingRoom = rooms.find(r => r.bookingId === bookingId);
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
            socket.join(bookingId);
            rooms.push(newRoom);
            io.in(bookingId).emit('online_users',newRoom);
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
            socket.join(bookingId);
            io.in(bookingId).emit('online_users',existingRoom);
        }
    });
});
