import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { addIcons } from 'ionicons';
import { logOutOutline, walletOutline, videocamOutline, settingsOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-title class="brand-title">Store Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="page-wrapper">
        
        <div class="profile-header">
          <div class="avatar-ring">
            <img src="assets/icon/favicon.png" alt="Store Avatar">
          </div>
          <div class="store-info">
            <h2>{{ userName }}</h2>
            <p>{{ userEmail }}</p>
            <span class="badge">Verified Seller</span>
          </div>
        </div>

        <div class="menu-list">
          <div class="menu-item" (click)="goToWallet()">
            <div class="menu-icon"><ion-icon name="wallet-outline"></ion-icon></div>
            <div class="menu-text">
              <h3>Revenue & Withdrawal</h3>
              <p>Manage your earnings</p>
            </div>
            <ion-icon name="chevron-forward-outline" class="forward-icon"></ion-icon>
          </div>
          <div class="menu-item" (click)="goToHistory()">
            <div class="menu-icon"><ion-icon name="videocam-outline"></ion-icon></div>
            <div class="menu-text">
              <h3>Live Stream History</h3>
              <p>View past broadcasts</p>
            </div>
            <ion-icon name="chevron-forward-outline" class="forward-icon"></ion-icon>
          </div>
          <div class="menu-item" (click)="goToSettings()">
            <div class="menu-icon"><ion-icon name="settings-outline"></ion-icon></div>
            <div class="menu-text">
              <h3>Store Settings</h3>
              <p>Update store details</p>
            </div>
            <ion-icon name="chevron-forward-outline" class="forward-icon"></ion-icon>
          </div>
          <div class="menu-item logout" (click)="logout()">
            <div class="menu-icon"><ion-icon name="log-out-outline"></ion-icon></div>
            <div class="menu-text">
              <h3>Sign Out</h3>
              <p>Log out of your account</p>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    .navy-dashboard-bg {
      --background: #0B1120;
    }
    .glass-toolbar {
      --background: rgba(11, 17, 32, 0.85);
      --border-width: 0;
      --padding-top: max(env(safe-area-inset-top, 20px), 32px);
      --padding-bottom: 16px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: -0.5px;
      color: #ffffff;
      padding-left: 12px;
      padding-top: 12px;
    }
    
    .page-wrapper {
      padding: 24px 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .profile-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      margin-bottom: 32px;
    }
    .avatar-ring {
      width: 72px; height: 72px; border-radius: 50%;
      background: #1e293b; padding: 2px;
      border: 2px solid #0284c7;
    }
    .avatar-ring img {
      width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
    }
    .store-info h2 { margin: 0 0 4px 0; font-size: 1.25rem; font-weight: 700; color: #ffffff; }
    .store-info p { margin: 0 0 8px 0; font-size: 0.9rem; color: #94a3b8; }
    .badge {
      background: rgba(16, 185, 129, 0.15); color: #34d399;
      font-size: 0.7rem; font-weight: 600; padding: 4px 8px; border-radius: 12px;
    }
    
    .menu-list {
      display: flex; flex-direction: column; gap: 12px;
    }
    .menu-item {
      display: flex; align-items: center; gap: 16px;
      background: rgba(30, 41, 59, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 16px; padding: 16px; cursor: pointer;
      transition: all 0.2s ease;
    }
    .menu-item:active { transform: scale(0.98); background: rgba(30, 41, 59, 0.5); }
    
    .menu-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(2, 132, 199, 0.1); color: #38bdf8;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .menu-text h3 { margin: 0 0 4px 0; font-size: 1rem; font-weight: 600; color: #e2e8f0; }
    .menu-text p { margin: 0; font-size: 0.8rem; color: #64748b; }
    
    .forward-icon { margin-left: auto; color: #64748b; font-size: 20px; }
    
    .menu-item.logout .menu-icon { background: rgba(225, 29, 72, 0.1); color: #fb7185; }
    .menu-item.logout .menu-text h3 { color: #fb7185; }
  `]
})
export class SellerProfileComponent implements OnInit {
  userName = 'Seller';
  userEmail = 'seller@example.com';

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ logOutOutline, walletOutline, videocamOutline, settingsOutline, chevronForwardOutline });
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || this.userName;
      this.userEmail = user.email || this.userEmail;
    }
  }

  goToWallet() {
    this.router.navigate(['/seller/profile/revenue']);
  }

  goToHistory() {
    this.router.navigate(['/seller/profile/history']);
  }

  goToSettings() {
    this.router.navigate(['/seller/profile/settings']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
