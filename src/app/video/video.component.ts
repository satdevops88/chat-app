import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VideoService } from './video.service';
import { Socket } from 'ngx-socket-io';
import { meeting } from "../../assets/js/meeting";

@Component({
  selector: 'stream',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  message: string;
  accessToken: string;
  roomName: string;
  username: string;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private videoService: VideoService, 
    private socket: Socket) {
  }
  ngOnInit() {
    this.roomName = this.route.snapshot.params.room_name;

    // meeting.setSocket(this.socket);
    // meeting.onaddstream = (e) => {
    //   if (e.type == "local") {
    //     this.localVideo.nativeElement.appendChild(e.video);
    //   }
    //   else if (e.type == "remote") {
    //     this.remoteVideo.nativeElement.appendChild(e.video);
    //   } else {
    //   }
    // };
    // meeting.openSignalingChannel = (callback) => {
    //   return this.socket.on('message', callback);
    // };
    // meeting.setup(this.roomName);
    console.log(this.roomName);
    this.username = 'agent';
    this.connect();
  }

  disconnect() {
    if (this.videoService.roomObj && this.videoService.roomObj !== null) {
      this.videoService.roomObj.disconnect();
      this.videoService.roomObj = null;
    }
  }

  connect(): void {
    let storage = JSON.parse(localStorage.getItem('token') || '{}');
    console.log(storage);
    let date = Date.now();
    if (!this.roomName || !this.username) { console.log('here'); this.message = "enter username and room name."; return; }
    if (storage['token'] && storage['created_at'] + 3600000 > date) {
      console.log('not Expired');
      this.accessToken = storage['token'];
      this.videoService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
      return;
    }
    this.videoService.getToken(this.username).subscribe(d => {
      this.accessToken = d['token'];
      console.log(this.accessToken);
      localStorage.setItem('token', JSON.stringify({
        token: this.accessToken,
        created_at: date
      }));
      this.videoService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
    },
      error => this.log(JSON.stringify(error)));
  }
  log(message) {
    this.message = message;
  }

}
