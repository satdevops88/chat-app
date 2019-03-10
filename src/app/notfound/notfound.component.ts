import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-not-found',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})

export class NotFoundComponent {

    constructor() { }

    goback() {
        window.history.back();
    }

}