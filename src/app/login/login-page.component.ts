import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

    @ViewChild('f') loginForm: NgForm;

    agentname = '';
    password = '';

    constructor(private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private toastr: ToastrService) { }

    // On submit button click    
    onSubmit() {
        this.authService.signinUser(this.agentname, this.password).subscribe(data => {
            this.toastr.success('Success')
            console.log(data)
            localStorage.setItem("agentId", data['agentId']);
            this.router.navigate(['customers']);
        }, (error) => {
            console.log(error);
            this.toastr.error(error['error'].message);
            this.loginForm.reset();
        });
    }
    // On Forgot password link click
    onForgotPassword() {
        // this.router.navigate(['forgotpassword'], { relativeTo: this.route.parent });
    }
    // On registration link click
    onRegister() {
        // this.router.navigate(['register'], { relativeTo: this.route.parent });
    }
}