import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-title class="brand-title">Seller Hub</ion-title>
        <div slot="end" class="header-profile" routerLink="/seller/profile">
          <div class="header-avatar">
            <img src="assets/icon/favicon.png" alt="Profile">
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="dashboard-wrapper">
        
        <!-- Go Live Banner -->
        <div class="go-live-banner" routerLink="/live-room">
          <div class="banner-bg-glow"></div>
          <div class="banner-info">
            <div class="live-badge">
              <div class="live-dot"></div>
              <span>LIVE ROOM</span>
            </div>
            <h2>Start Streaming Now</h2>
            <p>Engage with your buyers and boost your sales instantly.</p>
          </div>
          <div class="banner-icon-wrapper">
            <div class="play-btn">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" style="margin-left: 4px;">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Store Overview -->
        <div>
          <h2 class="section-title">Store Overview</h2>
          <div class="stats-grid">
            <div class="stat-card" (click)="goToOrders()">
              <div class="stat-icon orders">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ stats.orders_count }}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            
            <div class="stat-card" (click)="goToProducts()">
              <div class="stat-icon products">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ stats.products_count }}</h3>
                <p>Products</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="revenue-card">
          <div class="revenue-header">
            <span class="card-label">REVENUE TODAY</span>
            <div class="trend-badge">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span>Live</span>
            </div>
          </div>
          <h1 class="card-balance">Rp {{ stats.revenue_today | number }}</h1>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    .navy-dashboard-bg {
      --background: #0B1120; /* Deep Navy Blue */
    }
    
    .glass-toolbar {
      --background: rgba(11, 17, 32, 0.75);
      --border-width: 0;
      --padding-top: max(env(safe-area-inset-top, 20px), 32px);
      --padding-bottom: 12px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .brand-title {
      font-weight: 800;
      font-size: 1.6rem;
      letter-spacing: -0.5px;
      color: #ffffff;
      padding-left: 16px;
      padding-top: 8px;
    }
    
    .header-profile {
      padding-right: 20px;
      padding-top: 8px;
      cursor: pointer;
    }
    .header-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7, #6366f1);
      padding: 2px;
      box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
    }
    .header-avatar img {
      width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
      background: #1e293b;
    }
    
    .dashboard-wrapper {
      padding: 24px 20px 48px 20px;
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    /* Go Live Banner - Keep Maroon aesthetic but refined */
    .go-live-banner {
      position: relative;
      background: linear-gradient(135deg, rgba(225, 29, 72, 0.15) 0%, rgba(159, 18, 57, 0.3) 100%);
      border: 1px solid rgba(225, 29, 72, 0.2);
      border-radius: 24px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .go-live-banner:active { transform: scale(0.97); }
    .banner-info { display: flex; flex-direction: column; gap: 8px; z-index: 1; max-width: 70%; }
    .live-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(225, 29, 72, 0.2);
      border: 1px solid rgba(225, 29, 72, 0.3);
      padding: 4px 10px; border-radius: 12px;
      font-size: 0.75rem; font-weight: 700; color: #fda4af; width: fit-content;
    }
    .live-dot { width: 8px; height: 8px; background-color: #e11d48; border-radius: 50%; box-shadow: 0 0 8px #e11d48; }
    .banner-info h2 { margin: 4px 0 0 0; font-size: 1.5rem; font-weight: 800; color: #ffffff; }
    .banner-info p { margin: 0; font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); }
    .play-btn {
      width: 56px; height: 56px; background: #e11d48; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; color: white;
      box-shadow: 0 0 20px rgba(225, 29, 72, 0.4); z-index: 1; position: relative;
    }

    .section-title {
      font-size: 1.35rem; font-weight: 700; color: #ffffff; margin: 0 0 20px 0;
    }
    
    .stats-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
    }
    
    .stat-card {
      background: rgba(30, 41, 59, 0.5); /* Slate 800 / Navy translucent */
      border: 1px solid rgba(255, 255, 255, 0.08); /* Subtle sky blue border */
      border-radius: 20px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
    .stat-card:active { transform: scale(0.96); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .stat-card:hover { border-color: rgba(56, 189, 248, 0.3); background: rgba(30, 41, 59, 0.7); }
    
    .stat-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon.orders { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .stat-icon.products { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
    
    .stat-info h3 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .stat-info p { margin: 0; font-size: 0.9rem; color: #cbd5e1; font-weight: 500; }
    
    /* Revenue Card - Refined Navy Blue / Emerald accent */
    .revenue-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
      border-radius: 24px;
      padding: 28px;
      border: 1px solid rgba(16, 185, 129, 0.25); /* Emerald accent border */
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    }
    .revenue-card::before {
      content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
      background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.15), transparent 70%);
      pointer-events: none;
    }
    .revenue-header { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
    .card-label { font-size: 0.85rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.5px; }
    .trend-badge {
      display: flex; align-items: center; gap: 6px;
      background: rgba(16, 185, 129, 0.2);
      padding: 6px 12px; border-radius: 12px;
      font-size: 0.8rem; font-weight: 700; color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.1);
    }
    .card-balance { font-size: 2.5rem; font-weight: 800; color: #ffffff; margin: 0; position: relative; z-index: 2; letter-spacing: -1px; }
  `]
})
export class SellerDashboardComponent implements OnInit {
  stats = {
    orders_count: 0,
    products_count: 0,
    revenue_today: 0
  };

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.apiService.get('seller/dashboard').subscribe({
      next: (res: any) => {
        this.stats = res.data || { orders_count: 0, products_count: 0, revenue_today: 0 };
      },
      error: (err) => {
        console.error("Failed to load seller dashboard statistics", err);
      }
    });
  }

  goToOrders() {
    this.router.navigate(['/seller/orders']);
  }

  goToProducts() {
    this.router.navigate(['/seller/products']);
  }
}
