import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VideoService } from './video.service';

@Component({
  selector: 'video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {

  message: string;
  accessToken: string;
  roomName: string;
  username: string;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private videoService: VideoService) {
  }

  ngOnInit() {
    this.videoService.localVideo = this.localVideo;
    this.videoService.remoteVideo = this.remoteVideo;

    this.roomName = this.route.snapshot.params.room_name;

    setTimeout(() => {
      this.connect();
    }, 2000);

  }
  log(message) {
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
      this.videoService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
    },
      error => this.log(JSON.stringify(error)));
  }

  onCancel() {
    this.router.navigate(['customers']);
  }

}
