import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import '../../assets/js/meeting.js';
import { Socket } from 'ngx-socket-io';
import { meeting } from "../../assets/js/meeting";

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
    private toastr: ToastrService,private socket: Socket) {
  }

  ngOnInit() {
    this.roomName = this.route.snapshot.params.room_name;



    meeting.setSocket(this.socket);


    meeting.onaddstream = (e) => {
      if(e.type == "local") { 
        this.localVideo.nativeElement.appendChild(e.video);
      } 
      else if(e.type == "remote")
      {
        this.remoteVideo.nativeElement.appendChild(e.video);
      } else {

      }
    };
    meeting.openSignalingChannel = (callback) => {
      return this.socket.on('message', callback);
    };

    
    setTimeout( () => {
      meeting.check(this.roomName);
    }, 2000);
    

    console.log(this.roomName);
    // this.connect();
  }

}
