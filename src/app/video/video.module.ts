import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { VideoRoutingModule } from "./video-routing.module";

import { VideoComponent } from "./video.component";
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    imports: [
        CommonModule,
        VideoRoutingModule,
        NgxDatatableModule,
        FormsModule,
        NgbDatepickerModule.forRoot(),
        TranslateModule
    ],
    exports: [TranslateModule],
    declarations: [ VideoComponent ],
    providers: [],
})
export class VideoModule { }
