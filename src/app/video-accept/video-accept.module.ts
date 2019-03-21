import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { VideoAcceptRoutingModule } from "./video-accept-routing.module";

import { VideoAcceptComponent } from "./video-accept.component";
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    imports: [
        CommonModule,
        VideoAcceptRoutingModule,
        NgxDatatableModule,
        FormsModule,
        NgbDatepickerModule.forRoot(),
        TranslateModule
    ],
    exports: [TranslateModule],
    declarations: [ VideoAcceptComponent ],
    providers: [],
})
export class VideoAcceptModule { }
