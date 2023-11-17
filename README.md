## Git repository for David Ahmadov's, Bachelors degree thesis.

### Subject: Mediclinic, an app that facilitates booking consultations between patients and doctors.

### Tech stack:

- Backend: C#, .NET Core Webapi, SQL, Entity ORM
- Frontend: Ionic, Angular, Typescript, Javascript, HTML,CSS, WebRTC
- Signallig: Nodejs, Javascript, Express, SocketIO

1. Frontend app is a hybrid app that can run in a webrowser or in a mobile phone. Ionic provides flexibility to develop single source code that can be deployed to multiple platforms. Using this app patients and doctors can book appointments and perform audio and video calls.
2. Backend is used to authenticate users. Additionally save all necessary info about bookings etc.
3. Signalling is used to provide initial signalig that is necessary for WebRTC calls. After a call is established , webrtc uses p2p channels to perform calls.

Additional technical details are disscussed in the thesis writeup.

David Ahmadov Bsc Thesis - Development of mobile application for medical practice management.pdf

![Alt text](telemedic-architecture.png?raw=true "Telemedic Communication Architecture")
