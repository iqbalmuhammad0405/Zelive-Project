import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/buyer" class="neon-back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-bg">
      <div class="glow-spot glow-1"></div>
      
      <div class="profile-wrapper">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner-css"></div>
        </div>

        <div *ngIf="!loading && user">
          <!-- Avatar Section -->
          <div class="avatar-section">
            <div class="avatar-ring">
              <img [src]="user.profile?.avatar || 'assets/icon/favicon.png'" alt="Avatar">
              <div class="edit-badge">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </div>
            </div>
            <h2 class="user-name">{{ user.name }}</h2>
            <p class="user-email">{{ user.email }}</p>
          </div>

          <div class="glass-card form-card">
            <div class="section-title">Personal Information</div>
            
            <div class="input-container">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <input type="text" [(ngModel)]="formData.name" placeholder="Full Name" class="custom-html-input">
            </div>

            <div class="input-container">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <input type="tel" [(ngModel)]="formData.phone" placeholder="Phone Number" class="custom-html-input">
            </div>

            <div class="input-container">
              <div class="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <input type="email" [value]="user.email" disabled class="custom-html-input disabled">
            </div>

            <div class="input-container textarea-container">
              <div class="input-icon align-top">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <textarea [(ngModel)]="formData.bio" placeholder="Short Bio" class="custom-html-input" rows="3"></textarea>
            </div>
            
            <button class="primary-btn mt-20" [disabled]="submitting" (click)="saveProfile()">
              <span *ngIf="!submitting">Save Changes</span>
              <div class="spinner-css sm" *ngIf="submitting"></div>
            </button>
          </div>
          
          <button class="logout-btn" (click)="logout()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .profile-bg {
      --background: #08080d;
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
      background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%);
      top: -50px;
      right: -50px;
    }
    .glass-toolbar {
      --background: rgba(8, 8, 13, 0.7);
      --color: #ffffff;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title {
      font-weight: 700;
      font-size: 1.2rem;
      letter-spacing: -0.5px;
      color: #ffffff;
    }
    .neon-back-btn {
      color: #a855f7;
    }

    .profile-wrapper {
      padding: 16px;
      position: relative;
      z-index: 1;
      max-width: 600px;
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      justify-content: center;
      padding-top: 100px;
    }
    .spinner-css {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(168, 85, 247, 0.3);
      border-radius: 50%;
      border-top-color: #a855f7;
      animation: spin 1s ease-in-out infinite;
    }
    .spinner-css.sm {
      width: 24px;
      height: 24px;
      border-width: 2px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0 30px 0;
    }
    .avatar-ring {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
      position: relative;
      margin-bottom: 16px;
    }
    .avatar-ring img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #08080d;
      background: #11111d;
    }
    .edit-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #a855f7;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid #08080d;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }
    .user-name {
      color: #ffffff;
      font-weight: 800;
      font-size: 1.4rem;
      margin: 0 0 4px 0;
    }
    .user-email {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
      margin: 0;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      margin-bottom: 24px;
    }
    .section-title {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .input-container {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin-bottom: 12px;
      padding: 0 16px;
      height: 52px;
      display: flex;
      align-items: center;
      transition: all 0.3s;
    }
    .input-container:focus-within {
      border-color: #a855f7;
      background: rgba(0, 0, 0, 0.5);
    }
    .input-icon {
      color: rgba(255, 255, 255, 0.4);
      margin-right: 12px;
      display: flex;
    }
    .input-icon.align-top {
      align-self: flex-start;
      margin-top: 16px;
    }
    .input-container:focus-within .input-icon {
      color: #a855f7;
    }
    .textarea-container {
      height: auto;
      padding: 12px 16px;
    }
    .custom-html-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 0.95rem;
      font-family: inherit;
    }
    .custom-html-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    .custom-html-input.disabled {
      color: rgba(255, 255, 255, 0.4);
    }
    textarea.custom-html-input {
      resize: none;
      margin-top: 4px;
    }

    .mt-20 { margin-top: 20px; }
    
    .primary-btn {
      width: 100%;
      height: 52px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      border: none;
      border-radius: 16px;
      font-weight: 700;
      font-size: 1.05rem;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .primary-btn:hover {
      box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
    }
    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .logout-btn {
      width: 100%;
      height: 52px;
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-radius: 16px;
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  submitting = false;

  formData = {
    name: '',
    phone: '',
    bio: ''
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.apiService.get('profile').subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.formData.name = this.user.name || '';
        this.formData.phone = this.user.profile?.phone || '';
        this.formData.bio = this.user.profile?.bio || '';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showToast('Failed to load profile', 'danger');
      }
    });
  }

  saveProfile() {
    this.submitting = true;
    this.apiService.put('profile', this.formData).subscribe({
      next: (res: any) => {
        this.user = res.data;
        this.submitting = false;
        this.showToast('Profile updated successfully', 'success');
      },
      error: (err) => {
        this.submitting = false;
        this.showToast(`Failed to update profile: ${err.error?.message || err.message}`, 'danger');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
