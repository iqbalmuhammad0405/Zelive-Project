import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { videocamOutline, timeOutline, eyeOutline, chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-live-history',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/seller/profile" text="" icon="chevron-back-outline"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Live History</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="page-wrapper">
        <div class="empty-state" *ngIf="mockHistory.length === 0">
          <div class="empty-icon"><ion-icon name="videocam-outline"></ion-icon></div>
          <h3>No Live Streams Yet</h3>
          <p>Start broadcasting to see your history here.</p>
        </div>

        <div class="history-list" *ngIf="mockHistory.length > 0">
          <div class="history-card" *ngFor="let item of mockHistory">
            <div class="thumbnail">
              <div class="duration-badge">{{ item.duration }}</div>
            </div>
            <div class="details">
              <h4>{{ item.title }}</h4>
              <p class="date">{{ item.date }}</p>
              <div class="stats">
                <span class="stat-item"><ion-icon name="eye-outline"></ion-icon> {{ item.views }}</span>
                <span class="stat-item revenue">+ $ {{ item.revenue }}</span>
              </div>
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
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title {
      font-weight: 700;
      color: #ffffff;
    }
    ion-back-button {
      color: #a855f7;
    }
    .page-wrapper {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 60px 20px; text-align: center;
    }
    .empty-icon {
      width: 80px; height: 80px; border-radius: 50%;
      background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;
      font-size: 40px; color: #64748b; margin-bottom: 20px;
    }
    .empty-state h3 { color: #fff; margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 600; }
    .empty-state p { color: #64748b; margin: 0; font-size: 0.9rem; }

    .history-list {
      display: flex; flex-direction: column; gap: 16px;
    }
    .history-card {
      display: flex; gap: 16px; background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px;
      padding: 12px;
    }
    .thumbnail {
      width: 100px; height: 75px; border-radius: 12px;
      background: linear-gradient(135deg, #1e293b, #0f172a);
      position: relative; display: flex; align-items: flex-end; justify-content: flex-end;
      padding: 6px;
    }
    .duration-badge {
      background: rgba(0,0,0,0.7); color: #fff; font-size: 0.7rem;
      padding: 2px 6px; border-radius: 6px; font-weight: 600;
    }
    .details { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .details h4 { margin: 0 0 4px 0; color: #fff; font-size: 1rem; font-weight: 600; }
    .date { margin: 0 0 8px 0; color: #64748b; font-size: 0.8rem; }
    .stats { display: flex; align-items: center; gap: 16px; }
    .stat-item { display: flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 0.85rem; font-weight: 500; }
    .stat-item.revenue { color: #10b981; }
  `]
})
export class LiveHistoryComponent {
  mockHistory: any[] = [];

  constructor() {
    addIcons({ videocamOutline, timeOutline, eyeOutline, chevronBackOutline });
  }
}
