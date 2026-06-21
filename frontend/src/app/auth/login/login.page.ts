import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, Platform } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="login-bg" [fullscreen]="true">
      <div class="background-overlay"></div>
      <div class="login-wrapper">
        <div class="ambient-glows">
          <div class="glow-1"></div>
          <div class="glow-2"></div>
        </div>

        <div class="content-container">
          <div class="logo-container">
            <img src="assets/icon/favicon.png" class="neon-logo" alt="Zelive Logo">
            <h1 class="synthwave-gradient-text">Zelive</h1>
          </div>

          <div class="glass-card login-card">
            <h3 class="card-title">Welcome Back</h3>
            
            <div class="input-group">
              <div class="input-container">
                <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" [(ngModel)]="email" id="email" name="email" placeholder="Email Address" class="custom-html-input">
              </div>
              
              <div class="input-container">
                <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input type="password" [(ngModel)]="password" id="password" name="password" placeholder="Password" class="custom-html-input">
              </div>
            </div>

            <button class="primary-action-btn" [disabled]="loginLoading || googleLoading" (click)="login()">
              <span *ngIf="!loginLoading">Login</span>
              <div class="spinner-css" *ngIf="loginLoading"></div>
            </button>
            
            <div class="divider">
              <div class="line"></div>
              <span>OR</span>
              <div class="line"></div>
            </div>

            <button class="outline-action-btn" [disabled]="loginLoading || googleLoading" (click)="loginGoogle()">
              <svg class="google-svg" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span *ngIf="!googleLoading">Google Login</span>
              <div class="spinner-css google-spinner" *ngIf="googleLoading"></div>
            </button>
          </div>

          <div class="signup-footer">
            <p>Don't have an account?</p>
            <div class="btn-group">
              <button class="signup-link buyer" routerLink="/register-buyer">Sign Up</button>
              <span class="bullet">•</span>
              <button class="signup-link seller" routerLink="/register-seller">Sign Up as Seller</button>
            </div>
          </div>
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
      background: radial-gradient(circle at 50% 30%, #151228 0%, #07070d 100%);
      z-index: -1;
    }
    .login-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 32px 24px;
      position: relative;
      box-sizing: border-box;
      justify-content: center;
    }
    .ambient-glows {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      z-index: 0;
      pointer-events: none;
    }
    .glow-1 {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0) 70%);
      top: -50px;
      left: -100px;
      filter: blur(40px);
    }
    .glow-2 {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0) 70%);
      bottom: -100px;
      right: -150px;
      filter: blur(50px);
    }
    .content-container {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      z-index: 10;
    }
    .logo-container {
      text-align: center;
      margin-bottom: 32px;
    }
    .neon-logo {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.45));
    }
    .synthwave-gradient-text {
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff 40%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 12px;
      margin-bottom: 0;
      letter-spacing: -0.5px;
    }
    .login-card {
      background: rgba(20, 20, 35, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 28px 24px;
      margin-bottom: 24px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
    }
    .card-title {
      font-weight: 700;
      font-size: 1.5rem;
      margin-top: 0;
      margin-bottom: 24px;
      text-align: center;
      color: #fff;
    }
    .input-group {
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
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 24px 0;
      gap: 16px;
    }
    .divider .line {
      height: 1px;
      flex: 1;
      background: rgba(255, 255, 255, 0.1);
    }
    .divider span {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 1px;
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
    }
    .primary-action-btn:active {
      transform: scale(0.98);
    }
    .primary-action-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .outline-action-btn {
      width: 100%;
      height: 56px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 1.05rem;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: background 0.2s;
    }
    .outline-action-btn:active {
      background: rgba(255, 255, 255, 0.1);
    }
    .outline-action-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .google-svg {
      flex-shrink: 0;
    }
    .signup-footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.95rem;
    }
    .signup-footer p {
      margin: 0 0 12px 0;
    }
    .btn-group {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .signup-link {
      background: none;
      border: none;
      color: #a855f7;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      padding: 8px 0;
      border-radius: 10px;
      flex: 1;
    }
    .signup-link.buyer {
      text-align: right;
      padding-right: 16px;
    }
    .signup-link.seller {
      color: #06b6d4;
      text-align: left;
      padding-left: 16px;
    }
    .bullet {
      color: rgba(255, 255, 255, 0.2);
      flex-shrink: 0;
      width: 10px;
      text-align: center;
    }
    .spinner-css {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    .google-spinner {
      border-top-color: #a855f7;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  loginLoading = false;
  googleLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private platform: Platform,
    private ngZone: NgZone
  ) { }

  ngOnInit() { 
    if (this.authService.getToken() && this.authService.getUser()) {
      this.navigateDashboard(this.authService.getUser());
      return;
    }

    if (this.platform.is('capacitor')) {
      GoogleAuth.initialize({
        clientId: '65436456136-hru0k7l8m2q5jq4rvpvjlcssi6c4cj46.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }

  async login() {
    if (!this.email || !this.password) {
      this.showToast('Please enter both email and password', 'warning');
      return;
    }

    this.loginLoading = true;
    console.log('Sending normal login request to backend...');
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        console.log('Normal login response received:', JSON.stringify(res));
        localStorage.setItem('token', res.data.token);
        this.authService.setUser(res.data.user);
        this.showToast('Login successful!', 'success');
        this.navigateDashboard(res.data.user);
        this.loginLoading = false;
      },
      error: (err: any) => {
        console.error('Normal login error:', err);
        let errorMsg = 'Unknown error';
        try { errorMsg = this.extractError(err); } catch(e) { console.error('Extract error failed:', e); }
        this.showToast(`Login failed: ${errorMsg}`, 'danger');
        this.loginLoading = false;
      }
    });
  }

  async loginGoogle() {
    this.googleLoading = true;
    
    if (this.platform.is('capacitor')) {
      // Native App Flow (Smooth Popup)
      try {
        const googleUser = await GoogleAuth.signIn();
        const displayName = googleUser.name || ((googleUser.givenName || '') + ' ' + (googleUser.familyName || '')).trim() || 'Google User';
        this.sendGoogleDataToBackend({
          email: googleUser.email,
          name: displayName
        });
      } catch (err: any) {
        this.showToast(`Google login failed: ${err.message || JSON.stringify(err)}`, 'danger');
        this.googleLoading = false;
      }
    } else {
      // Web Flow (Redirect/Popup)
      this.showToast('Connecting to Google API...', 'medium');
      try {
        const app = initializeApp(environment.firebaseConfig);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        this.sendGoogleDataToBackend({
          email: result.user.email,
          name: result.user.displayName || 'Google User'
        });
      } catch (err: any) {
        this.showToast(`Google login failed: ${err.message}`, 'danger');
        this.googleLoading = false;
      }
    }
  }

  sendGoogleDataToBackend(data: any) {
    console.log('Sending Google data to backend:', JSON.stringify(data));
    this.authService.googleLogin(data).subscribe({
      next: (res: any) => {
        console.log('Google login response received:', JSON.stringify(res));
        this.ngZone.run(() => {
          this.googleLoading = false;
          if (res.data?.is_new_user) {
            this.router.navigate(['/google-register'], {
              queryParams: {
                email: res.data.email,
                name: res.data.name
              }
            });
          } else {
            localStorage.setItem('token', res.data.token);
            this.authService.setUser(res.data.user);
            this.showToast('Google login successful!', 'success');
            this.navigateDashboard(res.data.user);
          }
        });
      },
      error: (err: any) => {
        console.error('Google login error:', err);
        this.ngZone.run(() => {
          let errorMsg = 'Unknown error';
          try { errorMsg = this.extractError(err); } catch(e) { console.error('Extract error failed:', e); }
          this.showToast(`Google login validation failed: ${errorMsg}`, 'danger');
          this.googleLoading = false;
        });
      }
    });
  }

  extractError(err: any): string {
    if (err && err.error && err.error.errors) {
      const firstKey = Object.keys(err.error.errors)[0];
      return err.error.errors[firstKey][0];
    }
    return (err && err.error && err.error.message) || (err && err.message) || 'Unknown network error';
  }

  navigateDashboard(user: any) {
    const roles = user.roles || [];
    const isSeller = roles.some((r: any) => r.name === 'SELLER');
    if (isSeller) {
      this.router.navigate(['/seller']);
    } else {
      this.router.navigate(['/buyer']);
    }
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

