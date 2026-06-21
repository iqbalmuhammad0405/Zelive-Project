import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { UploadService } from '../../core/services/upload.service';
import { WalletService } from '../../core/services/wallet.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-title class="brand-title">Zelive</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/cart" class="nav-icon-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </ion-button>
          <ion-button routerLink="/wallet" class="nav-icon-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12" y2="18"/>
            </svg>
          </ion-button>
          <ion-button routerLink="/chat" class="nav-icon-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </ion-button>
          <ion-button (click)="logout()" class="nav-icon-btn logout-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="buyer-dashboard-bg">
      <div class="glow-spot glow-1"></div>
      <div class="glow-spot glow-2"></div>
      
      <div class="dashboard-wrapper">
        <h2 class="welcome-text">Welcome back, <span class="highlight">{{ userName }}</span>!</h2>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterProducts()" placeholder="Search products or stores..." class="search-input">
          </div>
        </div>

        <!-- Wallet Card (Digital Credit Card UX) -->
        <div class="digital-card" routerLink="/wallet">
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="card-header-row">
              <span class="card-brand">Zelive Wallet</span>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" class="chip-icon">
                <rect x="2" y="2" width="20" height="20" rx="4" fill="rgba(255,255,255,0.08)"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <line x1="12" y1="2" x2="12" y2="22"/>
              </svg>
            </div>
            
            <div class="card-balance-section">
              <span class="card-label">AVAILABLE BALANCE</span>
              <h1 class="card-balance">Rp {{ walletBalance | number }}</h1>
            </div>

            <div class="card-footer-row">
              <div class="card-holder">
                <span class="card-label">CARD HOLDER</span>
                <span class="card-holder-name">{{ userName }}</span>
              </div>
              <button class="topup-pill" (click)="$event.stopPropagation(); router.navigate(['/wallet'])">
                <span>TOP UP</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Profile & Avatar Section -->
        <div class="glass-card profile-card">
          <div class="avatar-edit-container">
            <div class="avatar-ring" (click)="openAvatarSourceSheet()">
              <img [src]="avatarUrl || 'assets/icon/favicon.png'" alt="Avatar" class="avatar-image">
              <div class="camera-badge">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            <div class="profile-text">
              <h3>{{ userName }}</h3>
              <p>{{ userEmail }}</p>
            </div>
          </div>

          <div class="profile-meta-row">
            <div class="meta-item">
              <span class="meta-val">BUYER</span>
              <span class="meta-lbl">Account Type</span>
            </div>
            <div class="meta-item">
              <span class="meta-val">Active</span>
              <span class="meta-lbl">Status</span>
            </div>
          </div>
        </div>

        <!-- Live Streams Section -->
        <div class="section-header" *ngIf="activeLiveStreams.length > 0">
          <h3>Live Now</h3>
        </div>

        <div class="live-scroll-container" *ngIf="activeLiveStreams.length > 0">
          <div class="live-item" *ngFor="let stream of activeLiveStreams" [routerLink]="['/live-room', stream.id]">
            <div class="live-avatar-container">
              <img [src]="stream.store?.logo_url || 'assets/icon/favicon.png'" class="live-avatar">
              <span class="live-badge">LIVE</span>
            </div>
            <span class="live-store-name">{{ stream.store?.name || 'Store' }}</span>
          </div>
        </div>

        <!-- Recommended Products Section -->
        <div class="section-header">
          <h3>Recommended Products</h3>
          <button class="see-all-btn" routerLink="/products">See All</button>
        </div>

        <div class="products-grid">
          <div class="product-item" *ngFor="let product of filteredProducts" [routerLink]="['/products', product.id]">
            <div class="product-image-container">
              <img [src]="product.image_url || 'assets/icon/favicon.png'" alt="Product" class="product-image">
              <span class="product-category-tag">Live Product</span>
            </div>
            <div class="product-info">
              <h4 class="product-title">{{ product.name }}</h4>
              <div class="price-row">
                <span class="product-price">Rp {{ product.price | number }}</span>
                <span class="buy-action-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="no-products-container" *ngIf="products.length === 0">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p>No recommended products available right now.</p>
        </div>
      </div>

      <!-- Hidden standard file input -->
      <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display:none">

      <!-- Custom Options Action Sheet (Bottom Sheet Modal) -->
      <div class="custom-sheet-overlay" *ngIf="showSourceSheet" (click)="closeAvatarSourceSheet()">
        <div class="custom-sheet" (click)="$event.stopPropagation()">
          <div class="sheet-handle"></div>
          <h4 class="sheet-title">Profile Photo Settings</h4>
          <button class="sheet-option-btn" (click)="triggerCameraMode()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>Take Photo (Camera)</span>
          </button>
          <button class="sheet-option-btn" (click)="triggerStoragePermissionCheck()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/>
              <rect x="2" y="10" width="20" height="4"/>
            </svg>
            <span>Choose from Gallery (Storage)</span>
          </button>
          <button class="sheet-option-btn danger" *ngIf="avatarUrl" (click)="removeAvatar()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            <span>Remove Photo</span>
          </button>
          <button class="sheet-cancel-btn" (click)="closeAvatarSourceSheet()">Cancel</button>
        </div>
      </div>

      <!-- Custom Storage Permission Notification Dialog -->
      <div class="permission-dialog-overlay" *ngIf="showPermissionDialog">
        <div class="permission-dialog-card">
          <div class="permission-icon-container">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#06b6d4" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>Allow access to storage?</h3>
          <p>Zelive requires access to your photos and files to upload your profile avatar.</p>
          <div class="permission-actions">
            <button class="permission-btn deny" (click)="denyPermission()">Don't Allow</button>
            <button class="permission-btn allow" (click)="grantPermission()">Allow</button>
          </div>
        </div>
      </div>

      <!-- Custom Live Webcam Dialog Modal -->
      <div class="camera-modal-overlay" *ngIf="showCameraModal">
        <div class="camera-modal-card">
          <div class="camera-modal-header">
            <h3>Take Profile Picture</h3>
            <button class="camera-close-btn" (click)="closeCameraModal()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="camera-view-container">
            <video #videoElement autoplay playsinline [class.hidden]="capturedImage" class="live-stream"></video>
            <img [src]="capturedImage" *ngIf="capturedImage" class="captured-preview">
            <canvas #canvasElement style="display:none" width="400" height="400"></canvas>
            <div class="camera-frame-guide" *ngIf="!capturedImage"></div>
          </div>

          <div class="camera-modal-actions">
            <!-- Capture Trigger -->
            <button class="capture-btn animate-pulse" *ngIf="!capturedImage" (click)="snapPhoto()">
              <div class="capture-inner"></div>
            </button>
            
            <!-- Confirmatory Actions -->
            <div class="confirm-actions-row" *ngIf="capturedImage">
              <button class="camera-action-btn retake" (click)="retakePhoto()">Retake</button>
              <button class="camera-action-btn use" (click)="saveCapturedPhoto()">
                <span>Use Photo</span>
                <span *ngIf="uploading" class="spinner"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .buyer-dashboard-bg {
      --background: #08080d;
      position: relative;
    }
    .glow-spot {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      filter: blur(60px);
    }
    .glow-1 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(168, 85, 247, 0) 70%);
      top: -20px;
      left: -50px;
    }
    .glow-2 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(6, 182, 212, 0) 70%);
      top: 250px;
      right: -100px;
    }
    .glass-toolbar {
      --background: rgba(8, 8, 13, 0.7);
      --color: #ffffff;
      --padding-top: max(env(safe-area-inset-top, 20px), 32px); /* Added aesthetic gap */
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 0 4px;
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.35rem;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 40%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-icon-btn {
      --color: rgba(255, 255, 255, 0.75);
      margin-left: 2px;
      transition: all 0.2s ease;
    }
    .nav-icon-btn:hover {
      --color: #a855f7;
    }
    .logout-btn:hover {
      --color: #ef4444;
    }
    .dashboard-wrapper {
      padding: 16px 16px 120px 16px; /* Massive padding-bottom to fix scroll */
      position: relative;
      z-index: 1;
      max-width: 600px;
      margin: 0 auto;
    }
    .welcome-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 8px 0 20px 0;
      letter-spacing: -0.5px;
    }
    .welcome-text .highlight {
      background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    /* Search Bar */
    .search-container {
      margin-bottom: 24px;
      position: relative;
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 0 16px;
      height: 48px;
      transition: all 0.2s ease;
    }
    .search-input-wrapper:focus-within {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.4);
      box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.15);
    }
    .search-icon {
      color: rgba(255, 255, 255, 0.4);
      margin-right: 12px;
    }
    .search-input {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 0.95rem;
      width: 100%;
      height: 100%;
      outline: none;
    }
    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    /* Digital Wallet Card Design */
    .digital-card {
      background: linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(79, 70, 229, 0.35);
      margin-bottom: 24px;
      cursor: pointer;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .digital-card:hover {
      transform: translateY(-2px);
    }
    .card-glow {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0) 70%);
      top: -60px;
      right: -40px;
      pointer-events: none;
    }
    .card-inner {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-brand {
      color: #ffffff;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.9;
    }
    .chip-icon {
      color: rgba(255, 255, 255, 0.7);
    }
    .card-balance-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .card-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      letter-spacing: 1.5px;
      margin-bottom: 4px;
    }
    .card-balance {
      font-size: 2.1rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .card-footer-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .card-holder {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .card-holder-name {
      color: #ffffff;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
    }
    .topup-pill {
      background: #ffffff;
      color: #4f46e5;
      border: none;
      padding: 8px 16px;
      border-radius: 30px;
      font-weight: 700;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    .topup-pill:hover {
      background: #f1f3f4;
      transform: scale(1.04);
    }

    /* Glassmorphic Profile Card */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 28px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .avatar-edit-container {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 16px;
    }
    .avatar-ring {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
      position: relative;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
      transition: transform 0.25s ease;
    }
    .avatar-ring:hover {
      transform: scale(1.03);
    }
    .avatar-image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #151525;
    }
    .camera-badge {
      position: absolute;
      bottom: -2px;
      right: -2px;
      background: #a855f7;
      color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      border: 2px solid #08080d;
    }
    .profile-text {
      text-align: left;
    }
    .profile-text h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px 0;
    }
    .profile-text p {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.45);
      margin: 0;
    }
    .profile-meta-row {
      display: flex;
      justify-content: space-around;
      padding-top: 4px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .meta-val {
      font-size: 0.95rem;
      font-weight: 700;
      color: #06b6d4;
    }
    .meta-lbl {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.4);
      margin-top: 2px;
      letter-spacing: 0.5px;
    }

    /* Section Headers */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0 16px 0;
    }
    .section-header h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .see-all-btn {
      background: none;
      border: none;
      color: #06b6d4;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    .see-all-btn:hover {
      color: #a855f7;
    }

    /* Live Streams UI */
    .live-scroll-container {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding-bottom: 12px;
      margin-bottom: 16px;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .live-scroll-container::-webkit-scrollbar {
      display: none;
    }
    .live-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      min-width: 70px;
    }
    .live-avatar-container {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #ef4444 0%, #a855f7 100%);
      margin-bottom: 6px;
    }
    .live-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: #151525;
      border: 2px solid #08080d;
    }
    .live-badge {
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: #fff;
      font-size: 0.55rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1.5px solid #08080d;
      letter-spacing: 0.5px;
    }
    .live-store-name {
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 600;
      max-width: 70px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Product Cards Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .product-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1);
    }
    .product-item:hover {
      transform: translateY(-4px);
      border-color: rgba(168, 85, 247, 0.25);
      box-shadow: 0 8px 24px rgba(168, 85, 247, 0.15);
      background: rgba(255, 255, 255, 0.04);
    }
    .product-image-container {
      position: relative;
      width: 100%;
      height: 130px;
      background: #11111d;
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-category-tag {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(168, 85, 247, 0.85);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
    }
    .product-info {
      padding: 12px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
      gap: 8px;
      text-align: left;
    }
    .product-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #ffffff;
      margin: 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 36px;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 4px;
    }
    .product-price {
      font-size: 0.95rem;
      font-weight: 700;
      color: #06b6d4;
    }
    .buy-action-btn {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.25s ease;
    }
    .product-item:hover .buy-action-btn {
      background: #a855f7;
      border-color: #a855f7;
      transform: scale(1.05);
    }
    .no-products-container {
      text-align: center;
      padding: 36px 16px;
      color: rgba(255, 255, 255, 0.4);
    }
    .empty-icon {
      color: rgba(255, 255, 255, 0.15);
      margin-bottom: 12px;
    }

    /* Custom Sheet Overlay (Bottom Action Sheet) */
    .custom-sheet-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: flex-end;
      animation: fadeInOverlay 0.25s ease-out;
    }
    .custom-sheet {
      width: 100%;
      background: #13141f;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px 24px 0 0;
      padding: 24px 16px 32px 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      animation: slideUpSheet 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .sheet-handle {
      width: 36px;
      height: 4px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
      margin: 0 auto 18px auto;
    }
    .sheet-title {
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0 0 16px 0;
      text-align: center;
    }
    .sheet-option-btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #ffffff;
      border-radius: 14px;
      padding: 14px 18px;
      margin-bottom: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .sheet-option-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.1);
    }
    .sheet-option-btn.danger {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.15);
    }
    .sheet-option-btn.danger:hover {
      background: rgba(239, 68, 68, 0.08);
    }
    .sheet-cancel-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.95rem;
      font-weight: 600;
      padding: 12px;
      margin-top: 4px;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    .sheet-cancel-btn:hover {
      color: #ffffff;
    }

    /* Custom Storage Permission Notification dialog */
    .permission-dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(5px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeInOverlay 0.2s ease-out;
    }
    .permission-dialog-card {
      width: 85%;
      max-width: 300px;
      background: #181926;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 24px 20px;
      text-align: center;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .permission-icon-container {
      margin-bottom: 16px;
    }
    .permission-dialog-card h3 {
      color: #ffffff;
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0 0 10px 0;
    }
    .permission-dialog-card p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      line-height: 1.4;
      margin: 0 0 20px 0;
    }
    .permission-actions {
      display: flex;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin: 0 -20px -24px -20px;
    }
    .permission-btn {
      flex: 1;
      background: none;
      border: none;
      padding: 16px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .permission-btn.deny {
      color: #ef4444;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0 0 0 18px;
    }
    .permission-btn.deny:hover {
      background: rgba(239, 68, 68, 0.03);
    }
    .permission-btn.allow {
      color: #06b6d4;
      border-radius: 0 0 18px 0;
    }
    .permission-btn.allow:hover {
      background: rgba(6, 182, 212, 0.03);
    }

    /* Live Webcam Capture Dialog */
    .camera-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(5px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeInOverlay 0.25s ease-out;
    }
    .camera-modal-card {
      width: 90%;
      max-width: 400px;
      background: #13141f;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }
    .camera-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .camera-modal-header h3 {
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
    }
    .camera-close-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      display: flex;
      padding: 4px;
      transition: color 0.15s ease;
    }
    .camera-close-btn:hover {
      color: #ffffff;
    }
    .camera-view-container {
      width: 100%;
      height: 280px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .live-stream, .captured-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .live-stream.hidden {
      display: none;
    }
    .camera-frame-guide {
      position: absolute;
      width: 200px;
      height: 200px;
      border: 2px dashed rgba(6, 182, 212, 0.6);
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    }
    .camera-modal-actions {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .capture-btn {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #ffffff;
      border: 4px solid #a855f7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .capture-btn:hover {
      transform: scale(1.05);
      border-color: #06b6d4;
    }
    .capture-inner {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #a855f7;
      transition: all 0.2s ease;
    }
    .capture-btn:hover .capture-inner {
      background: #06b6d4;
    }
    .confirm-actions-row {
      display: flex;
      gap: 16px;
      width: 100%;
    }
    .camera-action-btn {
      flex: 1;
      border: none;
      padding: 12px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .camera-action-btn.retake {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .camera-action-btn.retake:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    .camera-action-btn.use {
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .camera-action-btn.use:hover {
      box-shadow: 0 6px 16px rgba(168, 85, 247, 0.45);
      transform: translateY(-1px);
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s infinite linear;
    }

    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUpSheet {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .7; }
    }
  `]
})
export class BuyerDashboardComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  selectedFile: File | null = null;
  walletBalance = 0;
  products: any[] = [];
  filteredProducts: any[] = [];
  activeLiveStreams: any[] = [];
  searchQuery = '';
  uploading = false;

  userName = '';
  userEmail = '';
  avatarUrl = '';

  // Dialog / Modal Toggles
  showSourceSheet = false;
  showPermissionDialog = false;
  showCameraModal = false;

  // Live Camera stream
  cameraStream: MediaStream | null = null;
  capturedImage: string | null = null;

  constructor(
    private uploadService: UploadService,
    private walletService: WalletService,
    private productService: ProductService,
    private authService: AuthService,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    public router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || 'Zelive User';
      this.userEmail = user.email || 'user@zelive.com';
      this.avatarUrl = user.profile?.avatar || '';
    }

    this.loadWalletBalance();
    this.loadProducts();
    this.loadLiveStreams();
  }

  loadWalletBalance() {
    this.walletService.getBalance().subscribe({
      next: (res: any) => {
        this.walletBalance = res.data?.balance || res.balance || 0;
      }
    });
  }

  loadLiveStreams() {
    this.apiService.get('live/active').subscribe({
      next: (res: any) => {
        this.activeLiveStreams = res.data || [];
      },
      error: () => {
        console.error('Failed to load active live streams');
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        let items = res.data || res || [];
        if (items && !Array.isArray(items) && items.data && Array.isArray(items.data)) {
          items = items.data;
        } else if (!Array.isArray(items)) {
          items = [];
        }
        this.products = items;
        this.filteredProducts = [...this.products];
      },
      error: () => {
        this.products = [];
        this.filteredProducts = [];
      }
    });
  }

  filterProducts() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.store?.name?.toLowerCase().includes(q)
    );
  }

  // --- Avatar Edit Source Options ---
  openAvatarSourceSheet() {
    this.showSourceSheet = true;
  }

  closeAvatarSourceSheet() {
    this.showSourceSheet = false;
  }

  // Option 1: Choose from Gallery (Storage Simulation)
  triggerStoragePermissionCheck() {
    this.closeAvatarSourceSheet();
    this.showPermissionDialog = true;
  }

  denyPermission() {
    this.showPermissionDialog = false;
    this.showToast('Permission to access photos denied.', 'danger');
  }

  grantPermission() {
    this.showPermissionDialog = false;
    this.showToast('Photo library access granted.', 'success');
    // Open hidden native file picker
    setTimeout(() => {
      this.fileInput.nativeElement.click();
    }, 300);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadAvatar();
    }
  }

  // Option 2: Live Camera capture using browser API
  async triggerCameraMode() {
    this.closeAvatarSourceSheet();
    this.capturedImage = null;
    this.showCameraModal = true;
    
    // Request direct camera access and stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: 'user' }
      });
      this.cameraStream = stream;
      
      // Allow DOM to render then bind stream
      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = stream;
        }
      }, 100);
      
      this.showToast('Camera access granted.', 'success');
    } catch (err: any) {
      this.showToast(`Unable to open camera: ${err.message || err}`, 'danger');
      this.showCameraModal = false;
    }
  }

  closeCameraModal() {
    this.stopCameraStream();
    this.showCameraModal = false;
    this.capturedImage = null;
  }

  stopCameraStream() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  snapPhoto() {
    if (!this.videoElement || !this.canvasElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw video frame to hidden canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      this.capturedImage = dataUrl;
      this.stopCameraStream();
    }
  }

  retakePhoto() {
    this.triggerCameraMode();
  }

  async saveCapturedPhoto() {
    if (!this.capturedImage) return;

    try {
      // Convert canvas base64 to File blob
      const res = await fetch(this.capturedImage);
      const blob = await res.blob();
      const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      this.selectedFile = file;
      this.uploadAvatar();
      this.closeCameraModal();
    } catch (err: any) {
      this.showToast('Failed to process snapped image.', 'danger');
    }
  }

  // --- Common Upload API Logic ---
  async uploadAvatar() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadService.uploadAvatar(this.selectedFile).subscribe({
      next: async (res: any) => {
        this.uploading = false;
        this.showToast('Avatar uploaded successfully!', 'success');
        
        // Update local profile visual
        if (res.data?.avatar || res.avatar) {
          this.avatarUrl = res.data?.avatar || res.avatar;
          
          // Keep local user object in sync
          const user = this.authService.getUser();
          if (user) {
            if (!user.profile) user.profile = {};
            user.profile.avatar = this.avatarUrl;
            this.authService.setUser(user);
          }
        }
        
        this.selectedFile = null;
      },
      error: async (err) => {
        this.uploading = false;
        this.showToast('Failed to upload avatar.', 'danger');
      }
    });
  }

  // Option 3: Remove Avatar
  removeAvatar() {
    this.closeAvatarSourceSheet();
    this.showToast('Photo removed successfully.', 'success');
    this.avatarUrl = '';
    const user = this.authService.getUser();
    if (user) {
      if (user.profile) user.profile.avatar = '';
      this.authService.setUser(user);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.showToast('Logged out successfully.', 'success');
    this.router.navigate(['/login']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
