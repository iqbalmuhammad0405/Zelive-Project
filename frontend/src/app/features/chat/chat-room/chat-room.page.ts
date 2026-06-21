import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/buyer"></ion-back-button>
        </ion-buttons>
        <ion-title>Support Chat</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding" #chatContent>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div *ngFor="let msg of messages" class="message" [ngClass]="msg.user.id === userId ? 'sent' : 'received'">
          <p class="msg-text">{{ msg.message }}</p>
          <span class="time">{{ msg.user.name }}</span>
        </div>
        <div *ngIf="messages.length === 0" class="ion-text-center ion-padding" style="color: #888;">
          No messages yet. Send a message to start support.
        </div>
      </div>
    </ion-content>
    
    <ion-footer>
      <ion-toolbar color="light">
        <ion-input placeholder="Type a message..." [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" class="chat-input"></ion-input>
        <ion-button slot="end" fill="clear" (click)="sendMessage()">
          <ion-icon name="send" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [`
    .message { max-width: 80%; padding: 10px; border-radius: 12px; position: relative; word-wrap: break-word; }
    .message.received { background: var(--ion-color-light-shade, #e0e0e0); align-self: flex-start; border-bottom-left-radius: 0; }
    .message.sent { background: var(--ion-color-primary); color: white; align-self: flex-end; border-bottom-right-radius: 0; }
    .msg-text { margin: 0; font-size: 15px; }
    .time { font-size: 10px; opacity: 0.7; display: block; margin-top: 4px; text-align: right; }
    .chat-input { --background: #fff; --border-radius: 20px; --padding-start: 15px; margin: 5px 10px; }
  `]
})
export class ChatRoomPage implements OnInit, OnDestroy {
  @ViewChild('chatContent') chatContent!: ElementRef;
  roomId = 'support-room';
  messages: any[] = [];
  newMessage = '';
  echo: any;
  userId = '';

  constructor(private http: HttpClient, private authService: AuthService) {
    const user = this.authService.getUser();
    this.userId = user ? user.id : '';
    
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverb.key,
      wsHost: environment.reverb.wsHost,
      wsPort: environment.reverb.wsPort,
      wssPort: environment.reverb.wsPort,
      forceTLS: environment.reverb.forceTLS,
      disableStats: environment.reverb.disableStats,
    });
  }

  ngOnInit() {
    this.echo.channel(`live-chat.${this.roomId}`)
      .listen('LiveChatMessageSent', (e: any) => {
        this.messages.push({ user: e.user, message: e.message });
        setTimeout(() => this.scrollToBottom(), 100);
      });
  }

  ngOnDestroy() {
    this.echo.leaveChannel(`live-chat.${this.roomId}`);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    
    const msg = this.newMessage;
    this.newMessage = '';
    
    this.http.post(`${environment.apiUrl}/chat/send`, {
      room_id: this.roomId,
      message: msg
    }).subscribe({
      error: err => console.error("Failed to send message", err)
    });
  }

  scrollToBottom() {
    try {
      this.chatContent.nativeElement.scrollToBottom(300);
    } catch (err) {}
  }
}
