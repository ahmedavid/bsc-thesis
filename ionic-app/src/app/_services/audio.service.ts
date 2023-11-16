import {Injectable} from '@angular/core';
import {Howl} from 'howler';

/**Holds audio assets such as message received sound,call received sound */
const audioAssets = {
    message: {
        path: './assets/audio/message.mp3'
    },
    whatsapp: {
        path: './assets/audio/WhatsApp.mp3'
    },
    ring: {
        path: './assets/audio/ring.mp3'
    },
    local_ring: {
        path: './assets/audio/local_ring.mp3'
    }
}

/**Audio service is responsible for playing appropriate sounds such as 'Receiving a call','Receiving a message' */
@Injectable({providedIn:'root'})
export class AudioService {
    /**Currently loaded audio asset */
    activeTrack: Howl = null;

    /**Loads given asset and plays it */
    play(name: string,loop = false) {
        if(this.activeTrack){
            this.activeTrack.stop();
        }
        if(name === 'message') {
            this.activeTrack = new Howl({
                src: [audioAssets.whatsapp.path],
                loop,
                volume:1
            })
        }
        if(name === 'local_ring') {
            this.activeTrack = new Howl({
                src: [audioAssets.local_ring.path],
                loop,
                volume:0.3
            })
        }
        if(name === 'ring') {
            this.activeTrack = new Howl({
                src: [audioAssets.ring.path],
                loop,
                volume:0.3
            })
        }
        this.activeTrack.play();
    }
    /**Stop currently playing audio asset */
    stop() {
        this.activeTrack.stop();
    }
}