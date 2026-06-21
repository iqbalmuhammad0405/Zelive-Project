import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WalletService } from '../../core/services/wallet.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/buyer" class="neon-back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">My Cart</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="cart-bg">
      <div class="glow-spot glow-1"></div>
      
      <div class="cart-wrapper">
        <!-- Loading indicator -->
        <div *ngIf="loading" class="loading-state">
          <div class="spinner-css"></div>
          <p>Loading your cart...</p>
        </div>

        <!-- Empty Cart View -->
        <div *ngIf="!loading && (!cart || !cart.items || cart.items.length === 0)" class="empty-state">
          <div class="empty-icon-container">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h3>Your Cart is Empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button class="primary-btn mt-20" routerLink="/buyer">Start Shopping</button>
        </div>

        <!-- Cart Items List -->
        <div class="cart-items-container" *ngIf="!loading && cart && cart.items && cart.items.length > 0">
          <ion-item-sliding *ngFor="let item of cart.items" class="custom-sliding-item">
            <ion-item class="glass-item" lines="none">
              <div class="item-content">
                <div class="item-image-container">
                  <img [src]="item.product.image_url || 'assets/icon/favicon.png'" alt="Product Image" class="item-image">
                </div>
                
                <div class="item-details">
                  <h2 class="item-name">{{ item.product.name }}</h2>
                  <p class="item-price">Rp {{ item.product.price | number }}</p>
                  
                  <div class="qty-control-row">
                    <span class="stock-info" *ngIf="item.product.stock !== undefined">Stock: {{ item.product.stock }}</span>
                    
                    <div class="qty-stepper">
                      <button class="qty-btn" (click)="updateQuantity(item, item.quantity - 1)">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="updateQuantity(item, item.quantity + 1)">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ion-item>
            
            <ion-item-options side="end">
              <ion-item-option color="danger" (click)="removeItem(item)" class="delete-option">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </div>
      </div>
    </ion-content>

    <!-- Sticky Bottom Bar -->
    <ion-footer class="ion-no-border" *ngIf="!loading && cart && cart.items && cart.items.length > 0">
      <div class="sticky-bottom-bar">
        
        <div class="wallet-warning" *ngIf="walletBalance < totalAmount">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Insufficient wallet balance (Rp {{ walletBalance | number }})</span>
        </div>

        <div class="summary-row">
          <div class="total-info">
            <span class="total-label">Total Payment</span>
            <span class="total-value">Rp {{ totalAmount | number }}</span>
          </div>
          <button class="primary-btn checkout-btn" [disabled]="walletBalance < totalAmount" (click)="proceedCheckout()">
            Checkout
          </button>
        </div>
      </div>
    </ion-footer>
  `,
  styles: [`
    .cart-bg {
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
    
    .cart-wrapper {
      padding: 16px;
      position: relative;
      z-index: 1;
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
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-icon-container {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px auto;
      color: rgba(255, 255, 255, 0.2);
    }
    .empty-state h3 {
      color: #ffffff;
      font-weight: 700;
      font-size: 1.3rem;
      margin: 0 0 10px 0;
    }
    .empty-state p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.95rem;
      margin: 0;
    }
    .mt-20 { margin-top: 20px; }

    /* Cart Items */
    .cart-items-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .custom-sliding-item {
      background: transparent;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .glass-item {
      --background: rgba(255, 255, 255, 0.03);
      --padding-start: 12px;
      --inner-padding-end: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
    }
    .item-content {
      display: flex;
      width: 100%;
      padding: 12px 0;
      gap: 16px;
    }
    .item-image-container {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      background: #11111d;
      flex-shrink: 0;
    }
    .item-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .item-name {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .item-price {
      color: #06b6d4;
      font-size: 1.05rem;
      font-weight: 800;
      margin: 0 0 8px 0;
    }
    .qty-control-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stock-info {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
    }
    .qty-stepper {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 8px;
      padding: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .qty-btn {
      background: none;
      border: none;
      color: #a855f7;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      cursor: pointer;
    }
    .qty-value {
      color: #ffffff;
      font-weight: 700;
      font-size: 0.9rem;
      min-width: 24px;
      text-align: center;
    }

    .delete-option {
      background: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
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
      gap: 8px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 12px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-info {
      display: flex;
      flex-direction: column;
    }
    .total-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 2px;
    }
    .total-value {
      font-size: 1.3rem;
      font-weight: 800;
      color: #ffffff;
    }
    .primary-btn {
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      border: none;
      border-radius: 14px;
      font-weight: 700;
      font-size: 0.95rem;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
      cursor: pointer;
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
    .checkout-btn {
      padding: 12px 24px;
    }
  `]
})
export class CartComponent implements OnInit {
  cart: any = null;
  loading: boolean = true;
  walletBalance: number = 0;
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private walletService: WalletService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartAndWallet();
  }

  loadCartAndWallet() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;
        this.calculateTotal();
        this.fetchWalletBalance();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  fetchWalletBalance() {
    this.walletService.getBalance().subscribe({
      next: (res: any) => {
        this.walletBalance = res.data?.balance || res.balance || 0;
        this.loading = false;
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

  updateQuantity(item: any, newQty: number) {
    if (newQty < 1) {
      this.removeItem(item);
      return;
    }
    if (item.product.stock !== undefined && newQty > item.product.stock) {
      this.showToast(`Cannot exceed product stock (${item.product.stock})`, 'warning');
      return;
    }

    this.cartService.updateCartItem(item.id, newQty).subscribe({
      next: (res: any) => {
        item.quantity = newQty;
        this.calculateTotal();
      },
      error: (err) => {
        this.showToast(`Failed to update quantity: ${err.error?.message || err.message}`, 'danger');
      }
    });
  }

  removeItem(item: any) {
    this.cartService.removeFromCart(item.id).subscribe({
      next: () => {
        this.cart.items = this.cart.items.filter((i: any) => i.id !== item.id);
        this.calculateTotal();
        this.showToast(`${item.product.name} removed from cart`, 'medium');
      },
      error: (err) => {
        this.showToast(`Failed to remove item: ${err.error?.message || err.message}`, 'danger');
      }
    });
  }

  proceedCheckout() {
    if (this.walletBalance < this.totalAmount) {
      this.showToast('Insufficient balance!', 'danger');
      return;
    }
    this.router.navigate(['/checkout']);
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
