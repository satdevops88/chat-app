import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoAcceptComponent } from "./video-accept.component";

const routes: Routes = [
  {
    path: '',
     component: VideoAcceptComponent,
    data: {
      title: 'VideoAccept'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoAcceptRoutingModule { }
