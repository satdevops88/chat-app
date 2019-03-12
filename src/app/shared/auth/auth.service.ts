import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  token: string;

  constructor(private http: HttpClient, private router: Router) { }

  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser<T>(agentName: string, password: string): Observable<T> {
    //your code for checking credentials and getting tokens for for signing in user
    return this.http.post<T>((environment.apiUrl + 'agent/login'), { 'agentName': agentName, 'password': password });
  }

  logout() {
    this.token = null;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    // here you can check if user is authenticated or not through his token 
    return true;
  }
}
