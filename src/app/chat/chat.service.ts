import { Injectable } from '@angular/core';
import { Chat } from './chat.model';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ObserveOnOperator } from 'rxjs/internal/operators/observeOn';


@Injectable()
export class ChatService {

    private messages: any;
    private apiBaseUrl: string;
    private apiChatUrl: string;
    private actionUrl: string;
    userLists: any = [];

    constructor(private http: HttpClient, private socket: Socket) {
        this.apiBaseUrl = environment.apiUrl;
        this.apiChatUrl = environment.apiUrl + 'message/';
    }

    public getAllMessages<T>(agnetId: string): Observable<T> {
        this.actionUrl = this.apiChatUrl + 'getAllMessages/' + agnetId;
        console.log(this.actionUrl);
        return this.http.get<T>(this.actionUrl);
    }

    public getUserMessages<T>(customerId: string, agentId: string): Observable<T> {
        this.actionUrl = this.apiChatUrl + 'getUserMessages/';
        console.log(this.actionUrl);
        return this.http.get<T>(this.actionUrl + customerId + '/' + agentId);
    }

    public checkSMS<T>(customerId: string, agentId: string): Observable<T> {
        this.actionUrl = this.apiChatUrl + 'checkSMS/';
        return this.http.post<T>(this.actionUrl + customerId + '/' + agentId, {"check": 1});
    }

    public sendSMS<T>(customerId: string, content: string, agentId: string): Observable<T> {
        this.actionUrl = this.apiBaseUrl + 'sms';
        return this.http.post<T>(this.actionUrl, {"recipient": customerId, "message": content, "agentId": agentId});
    }
    public storeVideoSession<T>(customerId: string, agentId: string, meetingId: string): Observable<T> {
        this.actionUrl = this.apiBaseUrl + 'saveVideoSession';
        return this.http.post<T>(this.actionUrl, {"customerId": customerId, "agentId": agentId, "meetingId": meetingId});
    }
    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new_SMS', (message) => {
                console.log('new_SMS in socket.io')
                observer.next(message);
            });
        });
    }
    // public chat1: Chat[] = [
    //     new Chat(
    //         'right',
    //         'chat',
    //         'assets/img/portrait/small/avatar-s-1.png',
    //         '',
    //         [
    //             'How can we help? We are here for you!'
    //         ],
    //         'text'),
    //     new Chat(
    //         'left',
    //         'chat chat-left',
    //         'assets/img/portrait/small/avatar-s-3.png',
    //         '1 hour ago',
    //         [
    //             'Hey John, I am looking for the best admin template.',
    //             'Could you please help me to find it out?',
    //             'It should be angular 5 bootstrap compatible.'
    //         ]
    //         , 'text'),
    //     new Chat(
    //         'right',
    //         'chat',
    //         'assets/img/portrait/small/avatar-s-1.png',
    //         '30 minutes ago',
    //         [
    //             'Absolutely!',
    //             'Apex admin is the responsive angular 5 bootstrap admin template.'
    //         ]
    //         , 'text'),
    //     new Chat(
    //         'left',
    //         'chat chat-left',
    //         'assets/img/portrait/small/avatar-s-3.png',
    //         '20 minutes ago',
    //         [
    //             'Can you provide me audio link?'
    //         ]
    //         , 'text'),
    //     new Chat(
    //         'right',
    //         'chat',
    //         'assets/img/portrait/small/avatar-s-1.png',
    //         '',
    //         [
    //             'http://static.videogular.com/assets/audios/videogular.mp3'
    //         ]
    //         , 'audio'),
    //     new Chat(
    //         'left',
    //         'chat chat-left',
    //         'assets/img/portrait/small/avatar-s-3.png',
    //         '10 minutes ago',
    //         [
    //             'Can you provide me video link?'
    //         ]
    //         , 'text'),
    //     new Chat(
    //         'right',
    //         'chat',
    //         'assets/img/portrait/small/avatar-s-1.png',
    //         '',
    //         [
    //             'http://static.videogular.com/assets/videos/videogular.mp4'
    //         ]
    //         , 'video'),
    //     new Chat(
    //         'left',
    //         'chat chat-left',
    //         'assets/img/portrait/small/avatar-s-3.png',
    //         'just now',
    //         [
    //             'Looks clean and fresh UI.',
    //             'It is perfect for my next project.',
    //             'How can I purchase it?'
    //         ]
    //         , 'text'),
    //     new Chat(
    //         'right',
    //         'chat',
    //         'assets/img/portrait/small/avatar-s-1.png',
    //         '',
    //         [
    //             'Thanks, from ThemeForest.'
    //         ]
    //         , 'text'),
    //     new Chat(
    //         'left',
    //         'chat chat-left',
    //         'assets/img/portrait/small/avatar-s-3.png',
    //         '',
    //         [
    //             'I will purchase it for sure.',
    //             'Thanks.'
    //         ]
    //         , 'text'),
    // ];
   
}