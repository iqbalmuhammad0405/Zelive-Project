import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-seller-revenue',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/seller/profile" text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Revenue & Withdrawal</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="glow-spot glow-1"></div>
      
      <div class="page-wrapper">
        <div class="revenue-card">
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="card-header-row">
              <span class="card-brand">Zelive Earnings</span>
              <ion-icon name="cash-outline" class="cash-icon"></ion-icon>
            </div>
            
            <div class="card-balance-section">
              <span class="card-label">AVAILABLE TO WITHDRAW</span>
              <h1 class="card-balance">Rp {{ balance | number }}</h1>
            </div>

            <div class="card-footer-row">
              <div class="card-holder">
                <span class="card-label">LAST WITHDRAWAL</span>
                <span class="card-holder-name">{{ lastWithdrawalDate || 'None' }}</span>
              </div>
              <button class="withdraw-pill" (click)="requestWithdrawal()" [disabled]="balance <= 0">
                <ion-icon name="arrow-up-circle-outline"></ion-icon>
                <span>WITHDRAW</span>
              </button>
            </div>
          </div>
        </div>

        <div class="section-header">
          <h3>Transaction History</h3>
        </div>

        <div class="transactions-container">
          <div class="tx-item" *ngFor="let tx of transactions">
            <div class="tx-icon" [class.out]="tx.type === 'WITHDRAWAL'">
              <ion-icon [name]="tx.type === 'WITHDRAWAL' ? 'arrow-up-outline' : 'arrow-down-outline'"></ion-icon>
            </div>
            <div class="tx-details">
              <h4>{{ tx.description || (tx.type === 'WITHDRAWAL' ? 'Withdrawal to Bank' : 'Product Sale') }}</h4>
              <p>{{ tx.created_at | date:'MMM d, y, h:mm a' }}</p>
            </div>
            <div class="tx-amount" [class.out]="tx.type === 'WITHDRAWAL'">
              {{ tx.type === 'WITHDRAWAL' ? '-' : '+' }} Rp {{ tx.amount | number }}
            </div>
          </div>

          <div class="empty-state" *ngIf="transactions.length === 0">
            <ion-icon name="receipt-outline"></ion-icon>
            <p>No transactions yet.</p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .navy-dashboard-bg {
      --background: #08080d;
      position: relative;
    }
    .glow-spot {
      position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(60px);
    }
    .glow-1 {
      width: 300px; height: 300px; background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0) 70%);
      top: -50px; right: -50px;
    }
    .glass-toolbar {
      --background: rgba(8, 8, 13, 0.7); --color: #ffffff;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title { font-weight: 700; font-size: 1.25rem; color: #ffffff; }
    ion-back-button { color: #10b981; }
    
    .page-wrapper {
      padding: 24px 20px; max-width: 600px; margin: 0 auto; position: relative; z-index: 1;
    }

    /* Revenue Card */
    .revenue-card {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      border-radius: 20px; position: relative; overflow: hidden;
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.25);
      margin-bottom: 32px;
    }
    .card-glow {
      position: absolute; width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
      bottom: -60px; right: -40px; pointer-events: none;
    }
    .card-inner { padding: 24px; display: flex; flex-direction: column; gap: 28px; }
    .card-header-row { display: flex; justify-content: space-between; align-items: center; }
    .card-brand { color: #ffffff; font-weight: 700; font-size: 0.95rem; letter-spacing: 1px; text-transform: uppercase; }
    .cash-icon { color: rgba(255, 255, 255, 0.8); font-size: 24px; }
    .card-balance-section { display: flex; flex-direction: column; }
    .card-label { font-size: 0.7rem; font-weight: 600; color: rgba(255, 255, 255, 0.7); letter-spacing: 1.5px; margin-bottom: 4px; }
    .card-balance { font-size: 2.2rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
    .card-footer-row { display: flex; justify-content: space-between; align-items: flex-end; }
    .card-holder { display: flex; flex-direction: column; }
    .card-holder-name { color: #ffffff; font-weight: 600; font-size: 0.95rem; }
    
    .withdraw-pill {
      background: #ffffff; color: #059669; border: none; padding: 10px 18px;
      border-radius: 30px; font-weight: 700; font-size: 0.85rem;
      display: flex; align-items: center; gap: 6px; cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); transition: all 0.2s ease;
    }
    .withdraw-pill:active { transform: scale(0.96); }
    .withdraw-pill:disabled { opacity: 0.7; cursor: not-allowed; }

    /* Transactions */
    .section-header h3 { color: #ffffff; font-size: 1.15rem; font-weight: 700; margin: 0 0 16px 0; }
    
    .transactions-container { display: flex; flex-direction: column; gap: 12px; }
    .tx-item {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 16px;
    }
    .tx-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: rgba(16, 185, 129, 0.1); color: #10b981;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .tx-icon.out { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .tx-details { flex: 1; }
    .tx-details h4 { color: #e2e8f0; font-size: 0.95rem; font-weight: 600; margin: 0 0 4px 0; }
    .tx-details p { color: #64748b; font-size: 0.8rem; margin: 0; }
    .tx-amount { font-weight: 700; font-size: 1rem; color: #10b981; }
    .tx-amount.out { color: #ef4444; }

    .empty-state {
      padding: 40px 20px; text-align: center; color: #64748b;
    }
    .empty-state ion-icon { font-size: 48px; opacity: 0.5; margin-bottom: 12px; }
  `]
})
export class SellerRevenueComponent implements OnInit {
  balance = 0;
  transactions: any[] = [];
  lastWithdrawalDate: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchRevenue();
  }

  fetchRevenue() {
    this.http.get(environment.apiUrl + '/wallet/balance').subscribe({
      next: (res: any) => {
        this.balance = res.data?.balance || 0;
      },
      error: (err) => console.error(err)
    });

    this.http.get(environment.apiUrl + '/wallet/transactions').subscribe({
      next: (res: any) => {
        this.transactions = res.data || [];
        const lastWithdrawal = this.transactions.find(tx => tx.type === 'WITHDRAWAL');
        if (lastWithdrawal) {
          this.lastWithdrawalDate = new Date(lastWithdrawal.created_at).toLocaleDateString();
        }
      },
      error: (err) => console.error(err)
    });
  }

  requestWithdrawal() {
    if (this.balance <= 0) return;
    
    const amount = prompt("Enter amount to withdraw:");
    if (!amount) return;
    
    const val = parseInt(amount);
    if (isNaN(val) || val <= 0 || val > this.balance) {
      alert("Invalid amount or insufficient balance");
      return;
    }

    this.http.post(environment.apiUrl + '/wallet/withdraw', { amount: val }).subscribe({
      next: () => {
        alert("Withdrawal requested successfully!");
        this.fetchRevenue();
      },
      error: (err) => {
        alert("Withdrawal failed");
        console.error(err);
      }
    });
  }
}
