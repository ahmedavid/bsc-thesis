Git repository for David Ahmadov's, Bachelors degree thesis.

Subject: Mediclinic, an app that facilitates booking consultations between patients and doctors.

Tech stack:

- Backend: C#, .NET Webapi, Entity ORM
- Frontend: Ionic, Angular, Javascript, HTML,CSS, WebRTC
- Signallig: Nodejs, Express, SocketIO

1. Frontend app is a hybrid app that can run in a webrowser or in a mobile phone. Ionic provides flexibility to develop one source code that can be deployed to multiple platforms. Using this app patients and doctors can book appointments and perform audio and video calls.
2. Backend is used to register, login users. Additionally save all necessary info about bookings etc.
3. Signalling is used to provide initial signalig that is necessary for WebRTC calls. After call is established , webrtc uses p2p channels to perform calls.

Additionally this repository includes thesis writeup.

![Alt text](telemedic-architecture.png?raw=true "Telemedic Communication Architecture")
