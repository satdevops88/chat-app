import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { LoginRoutingModule } from "./login-routing.module";

import { LoginPageComponent } from "./login-page.component";


@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        FormsModule        
    ],
    declarations: [
        LoginPageComponent,
    ]
})
export class LoginModule { }
