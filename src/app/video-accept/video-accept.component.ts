import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import '../../assets/js/meeting.js';

@Component({
  selector: 'video-accept',
  templateUrl: './video-accept.component.html',
  styleUrls: ['./video-accept.component.scss']
})
export class VideoAcceptComponent implements OnInit {

  message: string;
  accessToken: string;
  roomName: string;
  username: string;
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.roomName = this.route.snapshot.params.room_name;
    let meeting = new Meeting();
    meeting.onaddstream = function (e) {
      this.localVideo.appendChild(e.video);
    };
    meeting.openSignalingChannel = function (callback) {
      return this.socket.on('message', callback);
    };
    meeting.check(this.roomName);
    console.log(this.roomName);
    // this.connect();
  }

}
