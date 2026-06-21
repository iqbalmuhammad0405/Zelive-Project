import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-title class="brand-title">Order Management</ion-title>
      </ion-toolbar>
      <div class="segment-wrapper">
        <ion-segment [(ngModel)]="selectedTab" mode="md" class="custom-segment">
          <ion-segment-button value="perlu_dikirim">
            <ion-label>Perlu Dikirim</ion-label>
          </ion-segment-button>
          <ion-segment-button value="dikirim">
            <ion-label>Dikirim</ion-label>
          </ion-segment-button>
          <ion-segment-button value="selesai">
            <ion-label>Selesai</ion-label>
          </ion-segment-button>
          <ion-segment-button value="dibatalkan">
            <ion-label>Dibatalkan</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="page-wrapper">
        
        <div class="empty-state">
          <div class="empty-icon-circle">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h3>Belum Ada Pesanan</h3>
          <p>Belum ada pesanan pada status "{{ getStatusText() }}" saat ini.</p>
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
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: -0.5px;
      color: #ffffff;
      padding-left: 12px;
      padding-top: 12px;
      padding-bottom: 8px;
    }
    
    .segment-wrapper {
      background: rgba(11, 17, 32, 0.85);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 0 12px 12px 12px;
    }
    
    .custom-segment {
      --background: #1E2230;
      border-radius: 8px;
    }
    
    ion-segment-button {
      --color: #94a3b8;
      --color-checked: #ffffff;
      --indicator-color: #0284c7; /* Sky blue */
      text-transform: none;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0;
    }
    
    .page-wrapper {
      padding: 24px 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 64px 20px;
      margin-top: 40px;
    }
    .empty-icon-circle {
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(30, 41, 59, 0.5); border: 1px dashed rgba(148, 163, 184, 0.3);
      display: flex; align-items: center; justify-content: center; color: #64748b;
      margin-bottom: 24px;
    }
    .empty-state h3 { font-size: 1.25rem; font-weight: 700; color: #e2e8f0; margin: 0 0 8px 0; }
    .empty-state p { font-size: 0.9rem; color: #94a3b8; margin: 0; line-height: 1.5; }
  `]
})
export class SellerOrdersComponent {
  selectedTab = 'perlu_dikirim';

  getStatusText() {
    switch(this.selectedTab) {
      case 'perlu_dikirim': return 'Perlu Dikirim';
      case 'dikirim': return 'Dikirim';
      case 'selesai': return 'Selesai';
      case 'dibatalkan': return 'Dibatalkan';
      default: return '';
    }
  }
}
