import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, cameraOutline, saveOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-store-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/seller/profile" text="" icon="chevron-back-outline"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Store Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="page-wrapper">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img [src]="avatarUrl || 'assets/icon/favicon.png'" alt="Store Avatar">
            <button class="edit-avatar-btn" (click)="fileInput.click()">
              <ion-icon name="camera-outline"></ion-icon>
            </button>
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display:none">
          </div>
          <p class="helper-text" *ngIf="!uploading">Tap to change store logo</p>
          <p class="helper-text" *ngIf="uploading" style="color: #38bdf8;">Uploading...</p>
        </div>

        <div class="form-container">
          <div class="input-group">
            <label>Store Name</label>
            <div class="input-container">
              <input type="text" [(ngModel)]="storeName" class="custom-input" placeholder="e.g. Zelive Official Store">
            </div>
          </div>

          <div class="input-group">
            <label>Email Address</label>
            <div class="input-container">
              <input type="email" [(ngModel)]="storeEmail" class="custom-input disabled" disabled>
            </div>
            <p class="hint">Email address cannot be changed.</p>
          </div>

          <div class="input-group">
            <label>Store Description</label>
            <div class="input-container textarea-container">
              <textarea [(ngModel)]="storeDesc" class="custom-input" rows="4" placeholder="Tell customers about your store..."></textarea>
            </div>
          </div>
        </div>

        <button class="primary-action-btn" (click)="saveSettings()">
          <ion-icon name="save-outline"></ion-icon>
          Save Changes
        </button>
      </div>
    </ion-content>
  `,
  styles: [`
    .navy-dashboard-bg { --background: #0B1120; }
    .glass-toolbar {
      --background: rgba(11, 17, 32, 0.7); --border-width: 0;
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      --padding-top: max(env(safe-area-inset-top, 20px), 32px);
      --padding-bottom: 16px;
    }
    .brand-title { font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    ion-back-button { color: #a855f7; }
    
    .page-wrapper { padding: 32px 20px; max-width: 600px; margin: 0 auto; }
    
    .avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; }
    .avatar-wrapper {
      position: relative; width: 120px; height: 120px; border-radius: 50%;
      background: rgba(30, 41, 59, 0.4); padding: 4px; border: 2px dashed rgba(56, 189, 248, 0.5);
      transition: all 0.3s ease;
    }
    .avatar-wrapper:hover { border-color: #38bdf8; background: rgba(30, 41, 59, 0.6); }
    .avatar-wrapper img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
    .edit-avatar-btn {
      position: absolute; bottom: 0; right: 4px; width: 36px; height: 36px;
      border-radius: 50%; background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: white; border: none;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
      cursor: pointer; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
      transition: transform 0.2s;
    }
    .edit-avatar-btn:active { transform: scale(0.9); }
    .helper-text { color: #94a3b8; font-size: 0.85rem; margin-top: 16px; font-weight: 500; }

    .form-container { display: flex; flex-direction: column; gap: 24px; margin-bottom: 40px; }
    .input-group label { display: block; color: #cbd5e1; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; margin-left: 4px; }
    .input-container {
      background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px; padding: 0 16px; height: 56px; display: flex; align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .input-container:focus-within { border-color: #a855f7; background: rgba(30, 41, 59, 0.8); box-shadow: 0 4px 20px rgba(168, 85, 247, 0.15), 0 0 0 3px rgba(168, 85, 247, 0.1); }
    .textarea-container { height: auto; padding: 16px; }
    .custom-input {
      width: 100%; background: transparent; border: none; outline: none;
      color: #f8fafc; font-size: 0.95rem; font-family: inherit;
    }
    .custom-input::placeholder { color: #64748b; }
    .custom-input.disabled { color: #64748b; }
    .hint { margin: 6px 0 0 4px; font-size: 0.8rem; color: #64748b; font-weight: 500; }

    .primary-action-btn {
      width: 100%; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: white;
      font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      box-shadow: 0 8px 25px rgba(168, 85, 247, 0.3); transition: all 0.2s;
    }
    .primary-action-btn:active { transform: scale(0.98); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2); }
  `]
})
export class StoreSettingsComponent implements OnInit {
  storeName = '';
  storeEmail = '';
  storeDesc = '';
  avatarUrl = '';
  uploading = false;

  constructor(private authService: AuthService, private apiService: ApiService, private toastController: ToastController) {
    addIcons({ 'chevron-back-outline': chevronBackOutline, 'camera-outline': cameraOutline, 'save-outline': saveOutline });
  }

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.storeName = user.name || '';
      this.storeEmail = user.email || '';
      this.avatarUrl = user.avatar_url || '';
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadAvatar(file);
    }
  }

  uploadAvatar(file: File) {
    this.uploading = true;
    const formData = new FormData();
    formData.append('image', file); // changed from 'avatar' to 'image' to match backend

    this.apiService.post('upload/avatar', formData).subscribe({
      next: async (res: any) => {
        this.avatarUrl = res.data.url; // changed from avatar_url to url
        
        // Update user context
        const user = this.authService.getUser();
        if (user) {
          user.avatar_url = this.avatarUrl;
          this.authService.setUser(user);
        }
        
        this.uploading = false;
        const toast = await this.toastController.create({
          message: 'Store logo updated successfully!',
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      },
      error: async (err) => {
        this.uploading = false;
        console.error(err);
        const toast = await this.toastController.create({
          message: 'Failed to upload logo.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
  }

  async saveSettings() {
    // Simulate API call
    const user = this.authService.getUser();
    if (user) {
      user.name = this.storeName;
      this.authService.setUser(user);
    }
    
    const toast = await this.toastController.create({
      message: 'Store settings saved successfully!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
