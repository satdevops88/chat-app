import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AddCustomerRoutingModule } from "./add-customer-routing.module";

import { AddCustomerComponent } from "./add-customer.component";
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    imports: [
        CommonModule,
        AddCustomerRoutingModule,
        NgxDatatableModule,
        FormsModule,
        NgbDatepickerModule.forRoot(),
        TranslateModule
    ],
    exports: [TranslateModule],
    declarations: [ AddCustomerComponent ],
    providers: [],
})
export class AddCustomerModule { }
