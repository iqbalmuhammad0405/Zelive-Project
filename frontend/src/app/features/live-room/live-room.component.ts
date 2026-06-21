import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { environment } from '../../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Peer from 'peerjs';

(window as any).Pusher = Pusher;

@Component({
  selector: 'app-live-room',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-content class="live-bg" [fullscreen]="true">
      
      <!-- Video Container (Full Screen) -->
      <div class="video-container" [class.blurred]="isEnded">
        <video #videoElement autoplay playsinline class="live-video" [muted]="isHost"></video>
        
        <div class="waiting-overlay" *ngIf="!streamActive && !isEnded">
           <div class="pulse-ring"></div>
           <p class="waiting-text">{{ isHost ? 'Initializing Camera...' : 'Waiting for Host to start...' }}</p>
        </div>
      </div>

      <!-- Live Stream Overlay UI -->
      <div class="live-overlay" *ngIf="!isEnded">
        
        <!-- Header: Host Info & Viewers -->
        <div class="live-header">
          <div class="host-badge">
            <div class="host-avatar">
              <img src="assets/icon/favicon.png" alt="Host">
            </div>
            <div class="host-info">
              <span class="host-name">{{ isHost ? 'You (Host)' : 'Zelive Official' }}</span>
              <span class="live-indicator">LIVE</span>
            </div>
            <button class="follow-btn" *ngIf="!isHost">Follow</button>
          </div>

          <div class="header-right">
            <div class="viewers-badge">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{{ viewerCount | number }}</span>
            </div>
            
            <button class="camera-switch-btn" *ngIf="isHost" (click)="switchCamera()">
              <ion-icon name="camera-reverse-outline"></ion-icon>
            </button>

            <button class="end-live-btn" *ngIf="isHost" (click)="confirmEndLive()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"></rect>
              </svg>
              END
            </button>

            <ion-button fill="clear" color="light" class="close-btn" *ngIf="!isHost" routerLink="/buyer">
              <ion-icon name="close-outline"></ion-icon>
            </ion-button>
          </div>
        </div>

        <!-- Pinned Product Showcase -->
        <div class="pinned-product-card" *ngIf="pinnedProduct" [class.slide-in]="pinnedProduct">
          <div class="product-img">
            <img [src]="pinnedProduct.image_url || 'assets/icon/favicon.png'" alt="Product">
          </div>
          <div class="product-info">
            <h4>{{ pinnedProduct.name }}</h4>
            <span class="price">Rp {{ pinnedProduct.price | number }}</span>
          </div>
          <button class="buy-btn" *ngIf="!isHost" (click)="buyPinnedProduct()">Buy</button>
          <button class="unpin-btn" *ngIf="isHost" (click)="unpinProduct()">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>

        <!-- Floating Chat Container -->
        <div class="chat-container">
          <div class="chat-messages" #chatContainer>
             <div class="system-msg">System: Welcome to the live room! Be respectful.</div>
             
             <div class="chat-msg" *ngFor="let msg of messages">
               <span class="user-name">{{ msg.user.name }}:</span> 
               <span class="msg-text">{{ msg.message }}</span>
             </div>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="bottom-actions">
          <div class="chat-input-wrapper">
            <input type="text" [(ngModel)]="newMessage" placeholder="Add a comment..." (keyup.enter)="sendMessage()" class="chat-input">
          </div>
          
          <div class="action-icons">
            <button class="icon-btn cart-btn" (click)="toggleProductsList()">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
            <button class="icon-btn like-btn" (click)="sendHeart()">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Flying Hearts Container -->
        <div class="flying-hearts-container">
           <div *ngFor="let heart of hearts" class="flying-heart" [ngStyle]="heart.style">
             <svg viewBox="0 0 24 24" width="32" height="32" [attr.fill]="heart.color" stroke="white" stroke-width="1.5">
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
             </svg>
           </div>
        </div>
      </div>

      <!-- Products Bottom Sheet -->
      <div class="products-sheet" [class.open]="showProductsList">
        <div class="sheet-header">
          <h3>Store Products</h3>
          <ion-button fill="clear" color="dark" (click)="toggleProductsList()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </div>
        <div class="sheet-content">
          <div class="product-list-item" *ngFor="let product of storeProducts">
            <img [src]="product.image_url || 'assets/icon/favicon.png'" alt="Product">
            <div class="item-details">
              <h4>{{ product.name }}</h4>
              <p>Rp {{ product.price | number }}</p>
            </div>
            <button *ngIf="isHost" class="pin-action-btn" (click)="pinProduct(product)">Pin</button>
            <button *ngIf="!isHost" class="buy-action-btn">Buy</button>
          </div>
          <div class="empty-state" *ngIf="storeProducts.length === 0">
            <p>No products available.</p>
          </div>
        </div>
      </div>

      <!-- Stream Ended Overlay -->
      <div class="stream-ended-overlay" *ngIf="isEnded">
        <div class="ended-card">
          <div class="ended-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 class="ended-title">Live Stream Ended</h2>
          <p class="ended-subtitle">Great job! Here are your live stream statistics.</p>
          
          <div class="stats-row">
            <div class="stat-item">
              <h4>{{ streamDuration }}</h4>
              <span>Duration</span>
            </div>
            <div class="stat-item">
              <h4>{{ maxViewers }}</h4>
              <span>Peak Viewers</span>
            </div>
            <div class="stat-item">
              <h4>{{ messages.length }}</h4>
              <span>Messages</span>
            </div>
          </div>

          <div class="stats-row" style="margin-top: 16px;">
            <div class="stat-item business">
              <h4>{{ itemsSold }}</h4>
              <span>Items Sold</span>
            </div>
            <div class="stat-item business">
              <h4>Rp {{ estimatedRevenue | number }}</h4>
              <span>Est. Revenue</span>
            </div>
          </div>
          <button class="done-btn" (click)="goBackToDashboard()">Return to Dashboard</button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .live-bg {
      --background: #000000;
    }
    .video-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #08080d;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      transition: filter 0.5s ease;
    }
    .video-container.blurred {
      filter: blur(20px) brightness(0.4);
    }
    .live-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .waiting-overlay {
      position: absolute;
      color: #ffffff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .waiting-text {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.8);
      text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    .pulse-ring {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 4px solid #a855f7;
      animation: pulsate 1.5s infinite ease-out;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.5);
    }
    @keyframes pulsate {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(1.5); opacity: 0; }
    }

    /* Overlay UI */
    .live-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none; /* Let clicks pass through to video */
    }

    .live-overlay > * {
      pointer-events: auto; /* Re-enable clicks for UI elements */
    }

    /* Header */
    .live-header {
      padding: env(safe-area-inset-top, 40px) 16px 16px 16px; 
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      pointer-events: auto;
      z-index: 50;
      position: relative;
    }
    
    .host-badge {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
      border-radius: 30px;
      padding: 4px 12px 4px 4px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .host-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      border: 2px solid #a855f7;
    }
    .host-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .host-info {
      display: flex;
      flex-direction: column;
      margin-right: 12px;
      justify-content: center;
    }
    .host-name {
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 800;
      text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      line-height: 1.1;
    }
    .live-indicator {
      color: #ffffff;
      background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
      font-size: 0.6rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      width: fit-content;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      margin-top: 2px;
    }
    .follow-btn {
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow: 0 2px 10px rgba(168, 85, 247, 0.3);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .viewers-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .camera-switch-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.4);
      color: white;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      backdrop-filter: blur(10px);
      font-size: 1.2rem;
      cursor: pointer;
    }

    .end-live-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      cursor: pointer;
      transition: transform 0.2s;
      pointer-events: auto;
      z-index: 51;
    }
    .end-live-btn:active {
      transform: scale(0.95);
    }

    .close-btn {
      --padding-start: 0;
      --padding-end: 0;
      margin: 0;
      height: 36px;
      width: 36px;
      border-radius: 50%;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(10px);
    }

    /* Pinned Product */
    .pinned-product-card {
      position: absolute;
      top: 100px;
      right: 16px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      padding: 10px;
      width: 150px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 8px;
      animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes slideInRight {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .product-img {
      width: 100%;
      height: 90px;
      border-radius: 10px;
      overflow: hidden;
    }
    .product-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-info h4 {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 700;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price {
      font-size: 0.85rem;
      font-weight: 800;
      color: #a855f7;
    }
    .buy-btn {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .unpin-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    /* Chat Area */
    .chat-container {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 0 16px 8px 16px;
      /* Removed heavy linear-gradient to fix the transparent dark layer issue */
    }
    .chat-messages {
      max-height: 280px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-right: 40px; /* Space for flying hearts */
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .chat-messages::-webkit-scrollbar {
      display: none;
    }
    
    .system-msg {
      color: #10b981;
      font-size: 0.85rem;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 8px 14px;
      border-radius: 16px;
      width: fit-content;
      backdrop-filter: blur(5px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .chat-msg {
      font-size: 0.95rem;
      line-height: 1.4;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      padding: 8px 14px;
      border-radius: 20px;
      width: fit-content;
      max-width: 85%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      display: inline-block;
    }
    .user-name {
      color: #d8b4fe;
      font-weight: 700;
      margin-right: 6px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }
    .msg-text {
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    }

    /* Bottom Actions */
    .bottom-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px env(safe-area-inset-bottom, 24px) 16px; 
    }
    .chat-input-wrapper {
      flex: 1;
    }
    .chat-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      color: #ffffff;
      border-radius: 24px;
      padding: 12px 16px;
      font-size: 0.95rem;
      outline: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      transition: all 0.3s;
    }
    .chat-input:focus {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.3);
    }
    .chat-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
    .action-icons {
      display: flex;
      gap: 12px;
    }
    .icon-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    .icon-btn:active {
      transform: scale(0.9);
    }
    .like-btn {
      background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%);
      border: none;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }
    
    /* Flying Hearts Animation */
    .flying-hearts-container {
      position: absolute;
      bottom: 80px;
      right: 16px;
      width: 60px;
      height: 300px;
      pointer-events: none;
      z-index: 100;
    }
    .flying-heart {
      position: absolute;
      bottom: 0;
      animation: floatUp 2.5s ease-in forwards;
      opacity: 0;
    }
    @keyframes floatUp {
      0% { transform: translateY(0) scale(0.5); opacity: 1; }
      20% { transform: translateY(-50px) translateX(-15px) scale(1.2); opacity: 0.9; }
      50% { transform: translateY(-150px) translateX(15px) scale(1); opacity: 0.8; }
      100% { transform: translateY(-300px) translateX(-20px) scale(0.8); opacity: 0; }
    }
    
    /* Stream Ended Overlay */
    .stream-ended-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .ended-card {
      background: rgba(20, 20, 35, 0.7);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 32px;
      padding: 40px 30px;
      width: 100%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .ended-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
    }
    .ended-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .ended-subtitle {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 32px 0;
    }
    .stats-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 40px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
    }
    .stat-item h4 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
    }
    .stat-item span {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.5);
      font-weight: 600;
    }
    .done-btn {
      width: 100%;
      height: 56px;
      border-radius: 20px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      font-size: 1.1rem;
      font-weight: 700;
      border: none;
      box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .done-btn:active {
      transform: scale(0.96);
    }
    .stat-item.business h4 {
      color: #34d399; /* Green color for money/sales */
    }
    
    /* Products Bottom Sheet */
    .products-sheet {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60%;
      background: #111827;
      border-radius: 24px 24px 0 0;
      z-index: 30;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1);
      display: flex;
      flex-direction: column;
      box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
    }
    .products-sheet.open {
      transform: translateY(0);
    }
    .sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .sheet-header h3 {
      margin: 0;
      color: white;
      font-size: 1.2rem;
      font-weight: 700;
    }
    .sheet-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }
    .product-list-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .product-list-item img {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      object-fit: cover;
    }
    .item-details {
      flex: 1;
    }
    .item-details h4 {
      margin: 0 0 4px 0;
      color: white;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .item-details p {
      margin: 0;
      color: #a855f7;
      font-size: 0.9rem;
      font-weight: 700;
    }
    .pin-action-btn, .buy-action-btn {
      background: #a855f7;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .empty-state {
      text-align: center;
      color: rgba(255,255,255,0.5);
      margin-top: 40px;
    }
  `]
})
export class LiveRoomComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  
  roomId = 'global-room';
  isHost = false;
  streamActive = false;
  isEnded = false;
  
  messages: any[] = [];
  newMessage = '';
  viewerCount = 0;
  maxViewers = 0;
  startTime!: Date;
  streamDuration = '00:00';
  
  // New UI logic variables
  showProductsList = false;
  pinnedProduct: any = null;
  itemsSold = 0;
  estimatedRevenue = 0;
  storeProducts: any[] = [];
  currentFacingMode: 'user' | 'environment' = 'user';
  
  hearts: any[] = [];
  heartColors = ['#ef4444', '#ec4899', '#f43f5e', '#a855f7', '#3b82f6'];
  
  echo: any;
  peer!: Peer;
  localStream!: MediaStream;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private alertController: AlertController,
    private ngZone: NgZone,
    private platform: Platform,
    private apiService: ApiService,
    private router: Router
  ) {
    const user = this.authService.getUser();
    this.isHost = user && user.roles && user.roles.some((r: any) => r.name === 'SELLER');

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
    this.setupWebSockets();
    
    if (this.isHost) {
      this.startHostStream();
      this.loadStoreProducts();
    }
    
    this.setupPeerJS();
  }

  loadStoreProducts() {
    this.apiService.get('seller/products').subscribe({
      next: (res: any) => {
        let items = res.data || res || [];
        if (items && !Array.isArray(items) && items.data && Array.isArray(items.data)) items = items.data;
        else if (!Array.isArray(items)) items = [];
        this.storeProducts = items;
      }
    });
  }

  goBackToDashboard() {
    this.cleanupStream();
    if (this.isHost) {
      this.router.navigate(['/seller']);
    } else {
      this.router.navigate(['/buyer']);
    }
  }

  ngOnDestroy() {
    this.cleanupStream();
  }
  
  cleanupStream() {
    try {
      this.echo.leaveChannel(`live-chat.${this.roomId}`);
      this.echo.leaveChannel(`presence-live-room.${this.roomId}`);
    } catch (err) {
      console.warn('Error leaving channels:', err);
    }
    
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (err) {}
    }
    
    if (this.localStream && typeof this.localStream.getTracks === 'function') {
      try {
        this.localStream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.warn('Error stopping local stream tracks:', err);
      }
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  setupWebSockets() {
    // 1. Presence Channel for Realtime Viewer Count
    this.echo.join(`presence-live-room.${this.roomId}`)
      .here((users: any[]) => {
        this.ngZone.run(() => {
          this.viewerCount = users.length;
          if (this.viewerCount > this.maxViewers) this.maxViewers = this.viewerCount;
        });
      })
      .joining((user: any) => {
        this.ngZone.run(() => {
          this.viewerCount++;
          if (this.viewerCount > this.maxViewers) this.maxViewers = this.viewerCount;
        });
      })
      .leaving((user: any) => {
        this.ngZone.run(() => {
          this.viewerCount--;
        });
      })
      .listen('.product.pinned', (e: any) => {
        this.ngZone.run(() => {
          if (e.product) {
            this.pinnedProduct = e.product;
          } else {
            this.pinnedProduct = null; // unpin
          }
        });
      });

    // 2. Standard Channel for Chat and Stream Events
    this.echo.channel(`live-chat.${this.roomId}`)
      .listen('LiveChatMessageSent', (e: any) => {
        this.ngZone.run(() => {
          this.messages.push({ user: e.user, message: e.message });
          this.scrollToBottom();
        });
      })
      .listen('LiveStreamStarted', (e: any) => {
        if (!this.isHost && e.peerId) {
          console.log("Host started streaming with Peer ID:", e.peerId);
          this.connectToHost(e.peerId);
        }
      });
  }

  setupPeerJS() {
    this.peer = new Peer();
    
    this.peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      if (this.isHost) {
        this.requestPermissionsAndStart(id);
      }
    });

    this.peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });
  }

  async requestPermissionsAndStart(peerId: string) {
    try {
      // Broadcast our Peer ID to audience
      this.http.post(`${environment.apiUrl}/live/broadcast-peer`, {
        room_id: this.roomId,
        peer_id: peerId
      }).subscribe();

      // Automatically answer incoming calls from audience
      this.peer.on('call', call => {
        console.log("Incoming call from audience");
        call.answer(this.localStream);
      });
    } catch (err) {
      console.error('Failed to init host stream', err);
      this.showPermissionAlert();
    }
  }

  startHostStream() {
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: this.currentFacingMode }, 
      audio: true 
    })
      .then(stream => {
        this.localStream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.streamActive = true;
        this.startTime = new Date();
      })
      .catch(err => console.error('Failed to get local stream', err));
  }

  async switchCamera() {
    if (!this.localStream) return;
    
    this.currentFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: this.currentFacingMode }, 
        audio: true 
      });
      
      const oldVideoTrack = this.localStream.getVideoTracks()[0];
      this.localStream.removeTrack(oldVideoTrack);
      oldVideoTrack.stop();
      
      const newVideoTrack = stream.getVideoTracks()[0];
      this.localStream.addTrack(newVideoTrack);
      this.videoElement.nativeElement.srcObject = this.localStream;
      
    } catch (err) {
      console.error('Failed to switch camera', err);
    }
  }

  async showPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Permissions Required',
      message: 'Zelive needs access to your Camera and Microphone to start the live stream. Please enable them in your device settings.',
      buttons: [
        {
          text: 'Okay',
          role: 'cancel'
        }
      ],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  connectToHost(hostPeerId: string) {
    // Audience calls the host
    const emptyStream = new MediaStream();
    const call = this.peer.call(hostPeerId, emptyStream);
    
    call.on('stream', remoteStream => {
      console.log("Received host stream");
      this.ngZone.run(() => {
        this.videoElement.nativeElement.srcObject = remoteStream;
        this.streamActive = true;
      });
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    
    const msg = this.newMessage;
    this.newMessage = ''; 
    
    // Optimistic UI update
    const user = this.authService.getUser();
    this.messages.push({ user: { name: user.name || 'You' }, message: msg });
    this.scrollToBottom();

    this.http.post(`${environment.apiUrl}/chat/send`, {
      room_id: this.roomId,
      message: msg
    }).subscribe({
      error: err => console.error("Failed to send message", err)
    });
  }
  
  sendHeart() {
    const newHeart = {
      id: Date.now() + Math.random(),
      color: this.heartColors[Math.floor(Math.random() * this.heartColors.length)],
      style: {
        left: Math.random() * 20 + 'px'
      }
    };
    this.hearts.push(newHeart);
    
    // Broadcast via WS could go here if needed for multiplayer hearts
    
    setTimeout(() => {
      this.hearts = this.hearts.filter(h => h.id !== newHeart.id);
    }, 2500);
  }
  
  async confirmEndLive() {
    const alert = await this.alertController.create({
      header: 'End Live Stream?',
      message: 'Are you sure you want to end this broadcast?',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { 
          text: 'End', 
          role: 'destructive',
          handler: () => {
            this.endLive();
          }
        }
      ]
    });
    await alert.present();
  }

  endLive() {
    this.isEnded = true;
    
    // Calculate final stats
    if (this.startTime) {
      const diff = new Date().getTime() - this.startTime.getTime();
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      this.streamDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      this.streamDuration = '00:00';
    }
    
    // Simulate commerce logic for demo purposes
    this.itemsSold = Math.floor(Math.random() * 5); // Realistic simulation
    this.estimatedRevenue = this.itemsSold * 150000;
    
    // Call backend to actually mark room as ENDED
    this.apiService.post(`live/rooms/${this.roomId}/end`, {}).subscribe({
      next: () => console.log('Live ended successfully on server'),
      error: err => console.error('Error ending live on server', err)
    });

    // Important: We call cleanupStream but force change detection if needed
    // The UI will show the stream ended overlay now
    this.cleanupStream();
  }
  
  toggleProductsList() {
    this.showProductsList = !this.showProductsList;
  }
  
  pinProduct(product: any) {
    this.pinnedProduct = product;
    // Broadcast pin via Reverb
    // this.http.post(...) -> triggers ProductPinned event
    this.showProductsList = false;
  }
  
  unpinProduct() {
    this.pinnedProduct = null;
    // Broadcast unpin via Reverb
  }
  
  buyPinnedProduct() {
    console.log('Buying product', this.pinnedProduct);
  }
}
