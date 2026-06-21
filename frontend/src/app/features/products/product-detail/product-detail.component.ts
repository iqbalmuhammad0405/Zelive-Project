import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="transparent-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/buyer" class="neon-back-btn"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="product-detail-bg" fullscreen>
      <div class="hero-image-container">
        <img [src]="product?.image_url || 'assets/icon/favicon.png'" alt="Product Image" class="hero-image">
        <div class="image-gradient-overlay"></div>
      </div>

      <div class="detail-content-wrapper">
        <div class="glass-card info-card">
          <div class="price-row">
            <h1 class="product-price">Rp {{ product?.price | number }}</h1>
            <span class="stock-badge">{{ product?.stock }} in stock</span>
          </div>
          
          <h2 class="product-title">{{ product?.name }}</h2>
          
          <div class="store-info-row" *ngIf="product?.store">
            <div class="store-avatar">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span class="store-name">{{ product?.store?.name || 'Zelive Verified Store' }}</span>
          </div>

          <div class="divider"></div>
          
          <div class="description-section">
            <h3>Description</h3>
            <p class="product-desc">{{ product?.description || 'No description provided.' }}</p>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border">
      <div class="bottom-action-bar">
        <button class="icon-action-btn" (click)="toggleWishlist()">
          <svg viewBox="0 0 24 24" width="24" height="24" [attr.fill]="isWishlisted ? '#ef4444' : 'none'" [attr.stroke]="isWishlisted ? '#ef4444' : 'currentColor'" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="secondary-btn" (click)="addToCart()">Add to Cart</button>
        <button class="primary-btn" (click)="buyNow()">Buy Now</button>
      </div>
    </ion-footer>
  `,
  styles: [`
    .product-detail-bg {
      --background: #08080d;
    }
    .transparent-toolbar {
      --background: transparent;
      position: absolute;
      top: 0;
      width: 100%;
    }
    .neon-back-btn {
      color: #ffffff;
      --icon-font-size: 28px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      margin-left: 12px;
      backdrop-filter: blur(5px);
    }
    
    .hero-image-container {
      position: relative;
      width: 100%;
      height: 45vh;
      background: #11111d;
    }
    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .image-gradient-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 150px;
      background: linear-gradient(to top, #08080d 0%, transparent 100%);
    }

    .detail-content-wrapper {
      padding: 0 16px 24px 16px;
      margin-top: -40px;
      position: relative;
      z-index: 10;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .product-price {
      font-size: 1.8rem;
      font-weight: 800;
      color: #06b6d4;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .stock-badge {
      background: rgba(168, 85, 247, 0.15);
      color: #a855f7;
      border: 1px solid rgba(168, 85, 247, 0.3);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    
    .product-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }

    .store-info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .store-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .store-name {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 20px 0;
    }

    .description-section h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
    }
    .product-desc {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
    }

    /* Bottom Action Bar */
    ion-footer {
      background: transparent;
    }
    .bottom-action-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: rgba(8, 8, 13, 0.9);
      backdrop-filter: blur(15px);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .icon-action-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .icon-action-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .secondary-btn {
      flex: 1;
      height: 50px;
      background: rgba(168, 85, 247, 0.15);
      color: #a855f7;
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 14px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .secondary-btn:hover {
      background: rgba(168, 85, 247, 0.25);
    }
    .primary-btn {
      flex: 1;
      height: 50px;
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
  `]
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  isWishlisted = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        this.product = res.data;
      },
      error: (err) => {
        this.showToast('Failed to load product details.', 'danger');
      }
    });
  }

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
    this.showToast(this.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist', 'success');
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => {
        this.showToast('Added to cart successfully!', 'success');
      },
      error: () => {
        this.showToast('Failed to add to cart.', 'danger');
      }
    });
  }

  buyNow() {
    if (!this.product) return;
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      },
      error: () => {
        this.showToast('Failed to process buy now.', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
