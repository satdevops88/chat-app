import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video';
import { Socket } from 'ngx-socket-io';


@Injectable()
export class VideoService {

    private apiBaseUrl: string;
    private apiVideoUrl: string;
    private actionUrl: string;

    firstScreenDiv: ElementRef;
    remoteVideo: ElementRef;
    localVideo: ElementRef;

    previewing: boolean;
    msgSubject = new BehaviorSubject("");
    roomObj: any;
    renderer: Renderer2;

    constructor(private http: HttpClient, private socket: Socket) {
        this.apiBaseUrl = environment.apiUrl;
        this.apiVideoUrl = environment.apiUrl + 'video/';
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new_SMS', (message) => {
                console.log('new_SMS in socket.io')
                observer.next(message);
            });
        });
    }


    getToken(username: string): Observable<any> {
        return this.http.post(this.apiVideoUrl + 'token', { "username": username });
    }

    connectToRoom(accessToken: string, options): void {
        console.log(options);
        connect(accessToken, options).then(room => {
            console.log(room);
            // this.roomObj = room;
            // if (!this.previewing && options['video']) {
            //     this.startLocalVideo();
            //     this.previewing = true;
            // }
            // room.participants.forEach(participant => {
            //     this.msgSubject.next("Already in Room: '" + participant.identity + "'");
            // });
            // room.on('participantDisconnected', (participant) => {
            //     this.msgSubject.next("Participant '" + participant.identity + "' left the room");
            //     // console.log("Participant '" + participant.identity + "' left the room");

            //     this.detachParticipantTracks(participant);
            // });
            // room.on('participantConnected', (participant) => {
            //     participant.tracks.forEach(track => {
            //         this.remoteVideo.nativeElement.appendChild(track.attach());
            //     });
            // });
            // // When a Participant adds a Track, attach it to the DOM.
            // room.on('trackAdded', (track, participant) => {
            //     console.log(participant.identity + " added track: " + track.kind);
            //     this.attachTracks([track], participant);
            // });
            // // When a Participant removes a Track, detach it from the DOM.
            // room.on('trackRemoved', (track, participant) => {
            //     console.log(participant.identity + " removed track: " + track.kind);
            //     this.detachTracks([track]);
            // });
            // room.once('disconnected', room => {
            //     this.msgSubject.next('You left the Room:' + room.name);
            //     room.localParticipant.tracks.forEach(track => {
            //         var attachedElements = track.detach();
            //         attachedElements.forEach(element => element.remove());
            //     });
            // });
            console.log(`Successfully joined a Room: ${room}`);
            room.on('participantConnected', participant => {
                console.log(`A remote Participant connected: ${participant}`);
            });
        }).catch( error => {
            console.error(error);
        });
    }
    attachTracks(tracks, participant) {
        tracks.forEach((track) => {
            if (track.kind == 'video') {
                if (participant.identity == 'Tutor A') {
                    if (track.name.substr(0, 5) == 'share') {
                        this.remoteVideo.nativeElement.appendChild(track.attach());
                        this.renderer.setStyle(this.firstScreenDiv.nativeElement, 'display', 'none');
                        var video = document.getElementsByTagName("video")[0];
                        $(video).css('width', '100%');
                    }
                }
                else if (participant.identity == 'manager') {
                }
                else if (participant.identity == 'Student A') {
                    this.remoteVideo.nativeElement.appendChild(track.attach());
                }
                else {
                }
            }
            else {
                this.remoteVideo.nativeElement.appendChild(track.attach());
            }
        });
    }

    startLocalVideo(): void {
        createLocalVideoTrack().then(track => {
            this.localVideo.nativeElement.appendChild(track.attach());
            var video = document.getElementsByTagName("video")[0];
            $(video).css('width', '100%');
        });
    }

    localPreview(): void {
        createLocalVideoTrack().then(track => {
            this.localVideo.nativeElement.appendChild(track.attach());
        });
    }

    detachParticipantTracks(participant) {
        var tracks = Array.from(participant.tracks.values());
        this.detachTracks(tracks);
    }

    detachTracks(tracks): void {
        tracks.forEach(function (track) {
            track.detach().forEach(function (detachedElement) {
                detachedElement.remove();
            });
        });
    }
}