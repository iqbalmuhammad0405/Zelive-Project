import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

declare var snap: any;

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/buyer" text="" class="custom-back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">My Wallet</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="buyer-dashboard-bg">
      <div class="glow-spot glow-1"></div>
      <div class="glow-spot glow-2"></div>
      
      <div class="dashboard-wrapper">
        <!-- Digital Wallet Card -->
        <div class="digital-card">
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="card-header-row">
              <span class="card-brand">Zelive Wallet</span>
              <ion-icon name="wallet-outline" class="wallet-icon"></ion-icon>
            </div>
            
            <div class="card-balance-section">
              <span class="card-label">AVAILABLE BALANCE</span>
              <h1 class="card-balance">Rp {{ balance | number }}</h1>
            </div>

            <div class="card-footer-row">
              <div class="card-holder">
                <span class="card-label">STATUS</span>
                <span class="card-holder-name">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-header">
          <h3>Top Up Balance</h3>
        </div>
        
        <div class="topup-grid">
          <div class="topup-item" *ngFor="let amt of topupOptions" 
               [class.selected]="selectedAmount === amt && customAmount === null"
               (click)="selectAmount(amt)">
            <span class="amt-text">{{ amt / 1000 }}k</span>
          </div>
        </div>
        
        <div class="custom-amount-container">
          <label>Custom Amount (Rp)</label>
          <div class="input-wrapper" [class.active]="customAmount !== null">
            <span class="currency-prefix">Rp</span>
            <input type="number" [(ngModel)]="customAmount" (ngModelChange)="onCustomAmountChange()" placeholder="Enter amount..." class="custom-input">
          </div>
        </div>

        <button class="pay-btn" (click)="processTopup()">
          <span>Pay Now</span>
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
        
        <div class="section-header" style="margin-top: 32px;">
          <h3>Transaction History</h3>
        </div>
        
        <div class="transactions-container">
          <div class="tx-item" *ngFor="let tx of transactions">
            <div class="tx-icon" [class.out]="tx.type !== 'TOPUP'">
              <ion-icon [name]="tx.type === 'TOPUP' ? 'arrow-down-outline' : 'arrow-up-outline'"></ion-icon>
            </div>
            <div class="tx-details">
              <h4>{{ tx.description || (tx.type === 'TOPUP' ? 'Wallet Top-up' : tx.type) }}</h4>
              <p>{{ tx.created_at | date:'MMM d, y, h:mm a' }}</p>
            </div>
            <div class="tx-amount" [class.out]="tx.type !== 'TOPUP'">
              {{ tx.type === 'TOPUP' ? '+' : '-' }} Rp {{ tx.amount | number }}
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
    .buyer-dashboard-bg { --background: #08080d; position: relative; }
    .glow-spot { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(60px); }
    .glow-1 { width: 250px; height: 250px; background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(168, 85, 247, 0) 70%); top: -20px; left: -50px; }
    .glow-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(6, 182, 212, 0) 70%); top: 250px; right: -100px; }
    
    .glass-toolbar {
      --background: rgba(8, 8, 13, 0.7); --color: #ffffff;
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title { font-weight: 700; font-size: 1.25rem; color: #ffffff; }
    .custom-back-btn { color: #a855f7; }
    
    .dashboard-wrapper { padding: 24px 16px 40px 16px; position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }

    /* Digital Wallet Card Design */
    .digital-card {
      background: linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%);
      border-radius: 20px; position: relative; overflow: hidden;
      box-shadow: 0 12px 30px rgba(79, 70, 229, 0.35); margin-bottom: 32px;
    }
    .card-glow {
      position: absolute; width: 200px; height: 200px; border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0) 70%);
      top: -60px; right: -40px; pointer-events: none;
    }
    .card-inner { padding: 24px; display: flex; flex-direction: column; gap: 28px; }
    .card-header-row { display: flex; justify-content: space-between; align-items: center; }
    .card-brand { color: #ffffff; font-weight: 700; font-size: 0.95rem; letter-spacing: 1px; text-transform: uppercase; }
    .wallet-icon { color: rgba(255, 255, 255, 0.8); font-size: 24px; }
    .card-balance-section { display: flex; flex-direction: column; align-items: flex-start; }
    .card-label { font-size: 0.7rem; font-weight: 600; color: rgba(255, 255, 255, 0.6); letter-spacing: 1.5px; margin-bottom: 4px; }
    .card-balance { font-size: 2.2rem; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
    .card-footer-row { display: flex; justify-content: space-between; align-items: flex-end; }
    .card-holder { display: flex; flex-direction: column; align-items: flex-start; }
    .card-holder-name { color: #ffffff; font-weight: 600; font-size: 0.95rem; }

    .section-header h3 { font-size: 1.15rem; font-weight: 700; color: #ffffff; margin: 0 0 16px 0; }
    
    .topup-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;
    }
    .topup-item {
      background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px; padding: 16px 0; text-align: center; cursor: pointer;
      transition: all 0.2s ease;
    }
    .topup-item.selected {
      background: rgba(168, 85, 247, 0.15); border-color: #a855f7; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
    }
    .amt-text { color: #f8fafc; font-weight: 600; font-size: 1.05rem; }
    .topup-item.selected .amt-text { color: #a855f7; }

    .custom-amount-container { margin-bottom: 24px; }
    .custom-amount-container label { display: block; color: #94a3b8; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; }
    .input-wrapper {
      background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px; height: 54px; display: flex; align-items: center; padding: 0 16px;
      transition: all 0.2s;
    }
    .input-wrapper.active { border-color: #06b6d4; background: rgba(30, 41, 59, 0.8); }
    .currency-prefix { color: #64748b; font-weight: 600; margin-right: 12px; }
    .input-wrapper.active .currency-prefix { color: #06b6d4; }
    .custom-input { width: 100%; background: transparent; border: none; outline: none; color: #fff; font-size: 1.1rem; font-weight: 600; }
    
    .pay-btn {
      width: 100%; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: #ffffff; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3); transition: all 0.2s ease;
    }
    .pay-btn:active { transform: scale(0.98); }

    /* Transactions */
    .transactions-container { display: flex; flex-direction: column; gap: 12px; }
    .tx-item {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 16px;
    }
    .tx-icon {
      width: 44px; height: 44px; border-radius: 12px; background: rgba(168, 85, 247, 0.1); color: #a855f7;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .tx-icon.out { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .tx-details { flex: 1; }
    .tx-details h4 { color: #e2e8f0; font-size: 0.95rem; font-weight: 600; margin: 0 0 4px 0; }
    .tx-details p { color: #64748b; font-size: 0.8rem; margin: 0; }
    .tx-amount { font-weight: 700; font-size: 1rem; color: #a855f7; }
    .tx-amount.out { color: #ef4444; }

    .empty-state { padding: 40px 20px; text-align: center; color: #64748b; }
    .empty-state ion-icon { font-size: 48px; opacity: 0.5; margin-bottom: 12px; }
  `]
})
export class WalletComponent implements OnInit, OnDestroy {
  balance = 0;
  topupOptions = [25000, 50000, 75000, 100000, 150000, 200000];
  selectedAmount = 25000;
  customAmount: number | null = null;
  transactions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchBalance();
    this.fetchTransactions();
  }

  ngOnDestroy() {
    if (typeof snap !== 'undefined' && snap.hide) {
      try {
        snap.hide();
      } catch (e) {
        console.error('Error hiding snap popup', e);
      }
    }
    const snapIframe = document.getElementById('snap-midtrans');
    if (snapIframe) {
      snapIframe.remove();
    }
  }

  fetchBalance() {
    this.http.get(environment.apiUrl + '/wallet/balance').subscribe((res: any) => {
      this.balance = res.data?.balance || 0;
    });
  }

  fetchTransactions() {
    this.http.get(environment.apiUrl + '/wallet/transactions').subscribe({
      next: (res: any) => {
        this.transactions = res.data || [];
      },
      error: (err) => {
        console.error("Failed to fetch transaction history", err);
      }
    });
  }

  selectAmount(amount: number) {
    this.selectedAmount = amount;
    this.customAmount = null;
  }

  onCustomAmountChange() {
    if (this.customAmount && this.customAmount > 0) {
      this.selectedAmount = this.customAmount;
    }
  }

  processTopup() {
    if (!this.selectedAmount || this.selectedAmount < 10000) {
      alert("Minimum top up is Rp 10.000");
      return;
    }

    this.http.post(environment.apiUrl + '/wallet/topup', { amount: this.selectedAmount }).subscribe({
      next: (res: any) => {
        if (res.data && res.data.snap_token) {
          snap.pay(res.data.snap_token, {
            onSuccess: (result: any) => {
              alert("Payment success!");
              this.fetchBalance();
              this.fetchTransactions();
            },
            onPending: (result: any) => {
              alert("Waiting for your payment!");
            },
            onError: (result: any) => {
              alert("Payment failed!");
            },
            onClose: () => {
              console.log('User closed the popup without finishing the payment');
            }
          });
        }
      },
      error: (err) => {
        alert("Failed to initiate payment");
        console.error(err);
      }
    });
  }
}
