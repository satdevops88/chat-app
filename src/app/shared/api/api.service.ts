/**
 * SMS Chat App
 * @author satDevops88 <sat.devops88@gmail.com>
 * @version 1.0.0
 * @description
 */

import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ApiService {

    private actionUrl: string;
    private apiBaseUrl: string;
    private serviceUrl: string;

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
        this.apiBaseUrl = environment.apiUrl;
    }

    public setService(service: string) {
        this.serviceUrl = service;
        this.actionUrl = this.apiBaseUrl + this.serviceUrl;
    }

    public getAll<T>(): Observable<T> {
        this.actionUrl = this.actionUrl + '/getAll';
        return this.http.get<T>(this.actionUrl);
    }

    public getSingle<T>(itemId: string): Observable<T> {
        return this.http.get<T>(this.actionUrl + itemId);
    }

    public add<T>(toAdd: any): Observable<T> {
        this.actionUrl = this.actionUrl + '/add';
        console.log(this.actionUrl);
        return this.http.post<T>(this.actionUrl, toAdd);
    }

    public update<T>(itemId: string, itemToUpdate: any): Observable<T> {
        return this.http
            .put<T>(this.actionUrl + itemId, JSON.stringify(itemToUpdate));
    }

    public delete<T>(itemId: string): Observable<T> {
        console.log(itemId);
        this.actionUrl = this.actionUrl + 'delete/';
        console.log(this.actionUrl + itemId);
        return this.http.delete<T>(this.actionUrl + itemId);
    }
}


