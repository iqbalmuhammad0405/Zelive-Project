import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { WalletService } from '../../core/services/wallet.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/cart" class="neon-back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Checkout</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="checkout-bg">
      <div class="glow-spot glow-1"></div>
      
      <div class="checkout-wrapper">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner-css"></div>
          <p>Loading checkout details...</p>
        </div>

        <div *ngIf="!loading">
          
          <!-- Step 1: Address -->
          <div class="step-container">
            <div class="step-header">
              <div class="step-number">1</div>
              <h3>Shipping Address</h3>
            </div>
            <div class="glass-card address-card">
              <textarea placeholder="Enter your full shipping address..." [(ngModel)]="address" class="custom-textarea" rows="3"></textarea>
            </div>
          </div>
          
          <!-- Step 2: Order Summary -->
          <div class="step-container">
            <div class="step-header">
              <div class="step-number">2</div>
              <h3>Order Summary</h3>
            </div>
            
            <div class="glass-card summary-card">
              <div class="order-item" *ngFor="let item of cart?.items">
                <div class="item-img-container">
                  <img [src]="item.product.image_url || 'assets/icon/favicon.png'" alt="Product">
                </div>
                <div class="item-details">
                  <h4 class="item-name">{{ item.product.name }}</h4>
                  <p class="item-qty">Qty: {{ item.quantity }}</p>
                </div>
                <div class="item-price">Rp {{ (item.product.price * item.quantity) | number }}</div>
              </div>
            </div>
          </div>

          <!-- Step 3: Payment Method -->
          <div class="step-container">
            <div class="step-header">
              <div class="step-number">3</div>
              <h3>Payment Method</h3>
            </div>
            
            <div class="payment-methods">
              <label class="payment-option selected">
                <input type="radio" name="payment" value="wallet" checked>
                <div class="payment-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12" y2="18"/>
                  </svg>
                </div>
                <div class="payment-details">
                  <h4>Zelive Wallet</h4>
                  <p>Balance: <span class="highlight">Rp {{ walletBalance | number }}</span></p>
                </div>
                <div class="check-circle"></div>
              </label>
              
              <label class="payment-option disabled">
                <input type="radio" name="payment" value="midtrans" disabled>
                <div class="payment-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div class="payment-details">
                  <h4>Credit/Debit Card</h4>
                  <p>Powered by Midtrans</p>
                </div>
                <div class="check-circle"></div>
              </label>
            </div>
          </div>

          <!-- Bill Details -->
          <div class="glass-card bill-card">
            <div class="bill-row">
              <span class="bill-label">Subtotal</span>
              <span class="bill-value">Rp {{ totalAmount | number }}</span>
            </div>
            <div class="bill-row">
              <span class="bill-label">Shipping Cost</span>
              <span class="bill-value free">Free</span>
            </div>
            <div class="bill-row total-row">
              <span class="bill-label total">Total Bill</span>
              <span class="bill-value total">Rp {{ totalAmount | number }}</span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
    
    <ion-footer class="ion-no-border" *ngIf="!loading">
      <div class="sticky-bottom-bar">
        <div class="wallet-warning" *ngIf="walletBalance < totalAmount">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Insufficient balance.</span>
        </div>
        
        <button class="primary-btn" [disabled]="submitting || walletBalance < totalAmount" (click)="payNow()">
          <span *ngIf="!submitting">Pay Now (Rp {{ totalAmount | number }})</span>
          <div class="spinner-css sm" *ngIf="submitting"></div>
        </button>
      </div>
    </ion-footer>
  `,
  styles: [`
    .checkout-bg {
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
      left: -50px;
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

    .checkout-wrapper {
      padding: 16px;
      position: relative;
      z-index: 1;
      max-width: 600px;
      margin: 0 auto;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      color: rgba(255, 255, 255, 0.6);
    }
    .spinner-css {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(168, 85, 247, 0.3);
      border-radius: 50%;
      border-top-color: #a855f7;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 16px;
    }
    .spinner-css.sm {
      width: 24px;
      height: 24px;
      border-width: 2px;
      margin-bottom: 0;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .step-container {
      margin-bottom: 24px;
    }
    .step-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
    }
    .step-header h3 {
      margin: 0;
      color: #ffffff;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    /* Address Textarea */
    .custom-textarea {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px;
      color: #ffffff;
      font-family: inherit;
      font-size: 0.95rem;
      resize: none;
      outline: none;
      transition: all 0.3s;
    }
    .custom-textarea:focus {
      border-color: #a855f7;
      background: rgba(0, 0, 0, 0.5);
    }
    .custom-textarea::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    /* Order Summary */
    .order-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 12px;
    }
    .order-item:last-child {
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }
    .item-img-container {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      overflow: hidden;
      background: #11111d;
      flex-shrink: 0;
    }
    .item-img-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 4px 0;
    }
    .item-qty {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      margin: 0;
    }
    .item-price {
      color: #06b6d4;
      font-weight: 700;
      font-size: 0.95rem;
    }

    /* Payment Methods */
    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .payment-option {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }
    .payment-option input {
      display: none;
    }
    .payment-option.selected {
      background: rgba(168, 85, 247, 0.1);
      border-color: #a855f7;
    }
    .payment-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .payment-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    .payment-option.selected .payment-icon {
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
    }
    .payment-details h4 {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    .payment-details p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
      margin: 0;
    }
    .payment-details .highlight {
      color: #06b6d4;
      font-weight: 700;
    }
    .check-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      position: absolute;
      right: 16px;
    }
    .payment-option.selected .check-circle {
      border-color: #a855f7;
      background: #a855f7;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
      background-size: 70%;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Bill Card */
    .bill-card {
      margin-top: 24px;
    }
    .bill-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .bill-row:last-child {
      margin-bottom: 0;
    }
    .bill-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
    }
    .bill-value {
      color: #ffffff;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .bill-value.free {
      color: #10b981;
    }
    .total-row {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 16px;
      margin-top: 16px;
    }
    .bill-label.total {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .bill-value.total {
      color: #06b6d4;
      font-weight: 800;
      font-size: 1.3rem;
    }

    /* Sticky Bottom Bar */
    ion-footer {
      background: transparent;
    }
    .sticky-bottom-bar {
      background: rgba(8, 8, 13, 0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px 20px;
      border-radius: 24px 24px 0 0;
      box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
    }
    .wallet-warning {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 12px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
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
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: any = null;
  loading = true;
  submitting = false;
  walletBalance = 0;
  totalAmount = 0;
  address = '';

  constructor(
    private cartService: CartService,
    private walletService: WalletService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDetails();
  }

  loadDetails() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;
        this.calculateTotal();
        this.walletService.getBalance().subscribe({
          next: (walletRes: any) => {
            this.walletBalance = walletRes.data?.balance || walletRes.balance || 0;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    this.totalAmount = 0;
    if (this.cart && this.cart.items) {
      for (const item of this.cart.items) {
        if (item.product) {
          this.totalAmount += item.product.price * item.quantity;
        }
      }
    }
  }

  async payNow() {
    if (!this.address.trim()) {
      this.showToast('Please enter your shipping address', 'warning');
      return;
    }

    if (this.walletBalance < this.totalAmount) {
      this.showToast('Insufficient wallet balance!', 'danger');
      return;
    }

    this.submitting = true;
    this.cartService.checkout().subscribe({
      next: async (res: any) => {
        this.submitting = false;
        const alert = await this.alertController.create({
          header: 'Order Placed!',
          message: 'Your payment was successful and your order has been placed.',
          buttons: [
            {
              text: 'Great',
              handler: () => {
                this.router.navigate(['/buyer']);
              }
            }
          ]
        });
        await alert.present();
      },
      error: (err: any) => {
        this.submitting = false;
        this.showToast(`Payment failed: ${err.error?.message || err.message}`, 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
