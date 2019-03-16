import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { ChatService } from './chat.service';
import { Chat } from './chat.model';

import { from } from 'rxjs/observable/from';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit {

  agentId: string;
  agentName: string;

  chat: Chat[];
  activeChatUser: string = '';
  activeChatUserImg: string = '';
  messageLists: any[];
  userLists: any = [];
  messages: any = [];
  customerId: string;

  @ViewChild('messageInput') messageInputRef: ElementRef;
  @ViewChild('scrollMe') myScrollContainer: ElementRef;

  item: number = 0;
  constructor(private elRef: ElementRef, private chatService: ChatService) {
    console.log('constructor');
    this.agentId = localStorage.getItem('agentId');
    this.agentName = localStorage.getItem('agentName');
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.onUserList();
    this.chatService.getMessages().subscribe(data => {
      console.log(data);
      console.log(this.customerId);
      console.log(this.userLists);
      console.log(this.chat);
      /**For updating userLists */
      this.onUserListUpdate(data.number, data.content, "inComing");
      if (this.customerId == data.number) {
        this.onChatListUpdate(data.content, "inComing");
      }
      /**For updating chatLists */
      // this.onChatListUpdate(data.content, "inComing");
      // this.activeChatUser = data.number;
      // this.activeChatUserImg = "assets/img/portrait/small/img_avatar.png";
    });
    $.getScript('./assets/js/chat.js');
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  private onUserListUpdate(customerId: string, content: string, direction: string) {
    this.userLists.forEach((element: any, index: number) => {
      if (element.number == customerId) {
        var lastmessage = content;
        if (lastmessage.length > 15) {
          lastmessage = lastmessage.substring(0, 14) + '...';
        }
        this.userLists[index].lastmessage = lastmessage;
        this.userLists[index].lasttime = this.getCurrentDateTime().time;
        if (direction == "inComing") this.userLists[index].unreadnum = this.userLists[index].unreadnum + 1;
        [this.userLists[0], this.userLists[index]] = [this.userLists[index], this.userLists[0]];
      }
    });
  }

  private onChatListUpdate(content: string, direction: string) {
    if (direction == "outGoing") {
      if (this.chat[this.chat.length - 1].avatar == "right") {
        this.chat[this.chat.length - 1].messages.push(content);
      } else {
        const messageInfo: any = {};
        messageInfo.avatar = "right";
        messageInfo.chatClass = "chat";
        messageInfo.imagePath = "assets/img/portrait/small/avatar-s-1.png";
        messageInfo.messageType = "text";
        const messagecontent: any = [];
        messagecontent.push(content);
        messageInfo.messages = messagecontent;
        messageInfo.time = this.getCurrentDateTime().date + ' ' + this.getCurrentDateTime().time;
        this.chat.push(messageInfo);
      }
    } else {
      if (this.chat[this.chat.length - 1].avatar == "left") {
        this.chat[this.chat.length - 1].messages.push(content);
      } else {
        const messageInfo: any = {};
        messageInfo.avatar = "left";
        messageInfo.chatClass = "chat chat-left";
        messageInfo.imagePath = "assets/img/portrait/small/img_avatar.png";
        messageInfo.messageType = "text";
        const messagecontent: any = [];
        messagecontent.push(content);
        messageInfo.messages = messagecontent;
        messageInfo.time = this.getCurrentDateTime().date + ' ' + this.getCurrentDateTime().time;
        this.chat.push(messageInfo);
      }
    }
    console.log(this.chat);
  }

  private onUserList() {
    this.userLists = [];
    this.chatService.getAllMessages(this.agentId).subscribe(data => {
      this.messageLists = data['result'];
      //getting latest customerId
      /**This onUserList is executed only one time when page reload */
      this.customerId = this.messageLists[0].fromnumber;
      this.onChatList(this.customerId);

      const people = this.messageLists;
      const source = from(people);
      const result = source.pipe(
        groupBy(people => people.fromnumber),
        mergeMap(group => group.pipe(toArray()))
      );
      result.subscribe(val => {
        var unreadnum = 0;
        val.forEach(element => {
          if (element.checked == 0) {
            unreadnum += 1;
          }
        });
        var time = val[0].created_at.split('T')[1];
        var hours = time.split(':')[0] + ':' + time.split(':')[1];
        var lastmessage = val[0].content;
        if (lastmessage.length > 15) {
          lastmessage = lastmessage.substring(0, 14) + '...';
        }
        var userList: any = {};
        userList.avatar = "assets/img/portrait/small/img_avatar.png";
        userList.number = val[0].fromnumber;
        userList.lasttime = hours;
        userList.lastmessage = lastmessage;
        userList.unreadnum = unreadnum;
        this.userLists.push(userList);
      });
      this.scrollToBottom();
    })
  }

  private onChatList(chatId: string) {
    this.messages = [];
    this.chatService.getUserMessages(chatId).subscribe(data => {

      const messageArray = data['result'];
      var messageInfo: any = {};
      var messagecontent: any = [];
      var direction = messageArray[0].direction;
      messageArray.forEach((element: any) => {
        if (direction != element.direction) {
          messageInfo.messages = messagecontent;
          this.messages.push(
            new Chat(messageInfo.avatar, messageInfo.chatClass, messageInfo.imagePath,
              messageInfo.datetime, messageInfo.messages, messageInfo.messageType)
          );
          messagecontent = [];
          messageInfo = {};
          direction = element.direction;
        }
        var date = element.created_at.split('T')[0];
        var time = element.created_at.split('T')[1];
        messageInfo.datetime = date + ' ' + time.split(':')[0] + ':' + time.split(':')[1];
        messageInfo.messageType = 'text';
        if (element.direction == "Outgoing") {
          messageInfo.avatar = 'right'
          messageInfo.chatClass = 'chat';
          messageInfo.imagePath = 'assets/img/portrait/small/avatar-s-1.png';
        } else {
          messageInfo.avatar = 'left'
          messageInfo.chatClass = 'chat chat-left';
          messageInfo.imagePath = 'assets/img/portrait/small/img_avatar.png';
        }
        messagecontent.push(element.content);
      });
      messageInfo.messages = messagecontent;
      this.messages.push(
        new Chat(messageInfo.avatar, messageInfo.chatClass, messageInfo.imagePath,
          messageInfo.datetime, messageInfo.messages, messageInfo.messageType)
      );
      this.chat = this.messages;
      this.activeChatUser = chatId;
      this.activeChatUserImg = "assets/img/portrait/small/img_avatar.png";
      this.scrollToBottom();
    })
  }
  public getCurrentDateTime() {
    var today = new Date();
    var year = today.getUTCFullYear();
    var month = today.getUTCMonth() + 1;
    var strMonth = month.toString();
    if (month < 10) strMonth = '0' + strMonth;
    var day = today.getUTCDate();
    var strDay = day.toString();
    if (day < 10) strDay = '0' + day;
    var hour = today.getUTCHours();
    var strHour = hour.toString();
    if (hour < 10) strHour = '0' + hour;
    var min = today.getUTCMinutes();
    var strMin = min.toString();
    if (min < 10) strMin = '0' + min;
    var date = year + "-" + strMonth + "-" + strDay;
    var time = strHour + ":" + strMin;
    return { "date": date, "time": time };
  }
  //send button function calls
  onAddMessage() {
    if (this.messageInputRef.nativeElement.value != "") {
      const content = this.messageInputRef.nativeElement.value;
      this.chatService.sendSMS(this.customerId, content).subscribe(data => {
        /**For updating chatList */
        this.onChatListUpdate(content, "outGoing");
        /**For updating UserList */
        this.onUserListUpdate(this.customerId, content, "outGoing");
        this.scrollToBottom();
      });
    }
    this.messageInputRef.nativeElement.value = "";
    this.messageInputRef.nativeElement.focus();
  }

  //chat user list click event function
  SetActive(event, chatId: string) {
    this.customerId = chatId;

    var hElement: HTMLElement = this.elRef.nativeElement;
    //now you can simply get your elements with their class name
    var allAnchors = hElement.getElementsByClassName('list-group-item');
    //do something with selected elements
    [].forEach.call(allAnchors, function (item: HTMLElement) {
      item.setAttribute('class', 'list-group-item no-border');
    });
    //set active class for selected item 
    event.currentTarget.setAttribute('class', 'list-group-item bg-blue-grey bg-lighten-5 border-right-primary border-right-2');
    this.onChatList(chatId);
  }

  public checkSMS() {
    this.chatService.checkSMS(this.customerId).subscribe(data => {
      this.userLists.forEach((element: any, index: number) => {
        if (element.number == this.customerId) {
          this.userLists[index].unreadnum = 0;
        }
      });
    });

    // this.onUserList();
  }

}
