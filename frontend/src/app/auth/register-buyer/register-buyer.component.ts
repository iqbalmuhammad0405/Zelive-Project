import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-buyer',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  template: `
    <ion-content class="register-bg">
    <ion-content class="register-bg" [fullscreen]="true">
      <div class="background-overlay"></div>
      <div class="register-wrapper">
        <div class="top-nav">
          <button class="back-btn" routerLink="/login">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        <div class="header-section">
          <img src="assets/icon/favicon.png" class="neon-logo" alt="Zelive Logo">
          <h1 class="page-title">Create <span>Buyer</span> Account</h1>
          <p class="subtitle">Explore and shop live products</p>
        </div>

        <div class="glass-card register-card">
          <form (ngSubmit)="register()">
            <div class="input-container">
              <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input type="text" [(ngModel)]="name" name="name" placeholder="Full Name" required class="custom-html-input">
            </div>

            <div class="input-container">
              <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input type="email" [(ngModel)]="email" name="email" placeholder="Email Address" required class="custom-html-input">
            </div>

            <div class="input-container">
              <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required class="custom-html-input">
            </div>

            <div class="input-container">
              <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input type="tel" [(ngModel)]="phone" name="phone" placeholder="Phone Number" class="custom-html-input">
            </div>

            <button type="submit" class="primary-action-btn" [disabled]="loading">
              <span *ngIf="!loading">Create Account</span>
              <div class="spinner-css" *ngIf="loading"></div>
            </button>
          </form>
        </div>

        <div class="login-footer">
          <p>Already have an account? <span class="login-link" routerLink="/login">Sign In</span></p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: transparent;
    }
    .background-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 0%, #1a1635 0%, #07070d 100%);
      z-index: -1;
    }
    .register-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 24px;
      position: relative;
    }
    .top-nav {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 20px;
    }
    .back-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 12px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .back-btn:active {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(0.95);
    }
    .header-section {
      text-align: center;
      margin-bottom: 32px;
    }
    .neon-logo {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      margin-bottom: 16px;
      filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.4));
    }
    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .page-title span {
      background: linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.95rem;
      margin: 0;
    }
    .register-card {
      background: rgba(20, 20, 35, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 28px 24px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
      margin-bottom: 24px;
    }
    .input-container {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      margin-bottom: 16px;
      padding: 0 16px;
      height: 56px;
      transition: all 0.3s ease;
    }
    .input-container:focus-within {
      border-color: #a855f7;
      box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
      background: rgba(0, 0, 0, 0.4);
    }
    .input-icon {
      color: rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
      margin-right: 12px;
      transition: color 0.3s ease;
    }
    .input-container:focus-within .input-icon {
      color: #a855f7;
    }
    .custom-html-input {
      flex: 1;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-size: 1rem;
      font-family: inherit;
      padding: 0;
    }
    .custom-html-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    .primary-action-btn {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      font-size: 1.05rem;
      font-weight: 600;
      border: none;
      box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 24px;
    }
    .primary-action-btn:active {
      transform: scale(0.98);
    }
    .primary-action-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .login-footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.95rem;
      margin-top: auto;
      padding-top: 20px;
    }
    .login-link {
      color: #a855f7;
      font-weight: 600;
      cursor: pointer;
    }
    .spinner-css {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterBuyerComponent {
  name = '';
  email = '';
  password = '';
  phone = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async register() {
    if (!this.name || !this.email || !this.password || !this.phone) {
      this.showToast('Please fill all validation fields', 'warning');
      return;
    }

    const hasLower = /[a-z]/.test(this.password);
    const hasUpper = /[A-Z]/.test(this.password);
    const hasDigit = /[0-9]/.test(this.password);
    if (this.password.length < 8 || !hasLower || !hasUpper || !hasDigit) {
      this.showToast('Password must contain at least 8 characters, with uppercase, lowercase, and numbers.', 'warning');
      return;
    }

    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!phoneRegex.test(this.phone)) {
      this.showToast('Please enter a valid Indonesian phone number (e.g. 081234567890)', 'warning');
      return;
    }

    this.loading = true;
    const regData = {
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone
    };

    this.authService.register(regData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.data.token);
        this.authService.setUser(res.data.user);
        this.showToast('Registration successful!', 'success');
        this.router.navigate(['/buyer']);
        this.loading = false;
      },
      error: (err: any) => {
        this.showToast(`Registration failed: ${this.extractError(err)}`, 'danger');
        this.loading = false;
      }
    });
  }

  extractError(err: any): string {
    if (err.error?.errors) {
      const firstKey = Object.keys(err.error.errors)[0];
      return err.error.errors[firstKey][0];
    }
    return err.error?.message || err.message;
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
