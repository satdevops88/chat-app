import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CustomersRoutingModule } from "./customers-routing.module";

import { CustomersComponent } from "./customers.component";



@NgModule({
    imports: [
        CommonModule,
        CustomersRoutingModule,
        NgxDatatableModule
    ],
    exports: [],
    declarations: [ CustomersComponent ],
    providers: [],
})
export class CustomersModule { }
