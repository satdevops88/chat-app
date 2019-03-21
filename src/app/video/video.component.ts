import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VideoService } from './video.service';
import '../../assets/js/meeting.js';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'video',
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
    private toastr: ToastrService,
    private videoService: VideoService, private socket: Socket, private renderer:Renderer2) {
  }
  ngOnInit() {
    this.roomName = this.route.snapshot.params.room_name;
    let meeting = new Meeting(this.socket);

    meeting.onaddstream = (e) => {
      this.localVideo.nativeElement.appendChild(e.video);
    };
    meeting.openSignalingChannel = (callback) => {
      return this.socket.on('message', callback);
    };

    
    meeting.setup(this.roomName);

    console.log(this.roomName);
    // this.connect();
  }
  log(message) {
    console.log(message);
    this.message = message;
  }
  connect(): void {
    let date = Date.now();
    this.username = 'manager';
    this.videoService.getToken(this.username).subscribe(d => {
      this.accessToken = d['token'];
      console.log(this.accessToken);

      localStorage.setItem('token', JSON.stringify({
        token: this.accessToken,
        created_at: date
      }));
      console.log('room_name:' + this.roomName)
      this.videoService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 420 } })
    },
      error => this.log(JSON.stringify(error)));
  }

  onCancel() {
    this.router.navigate(['customers']);
  }

}
