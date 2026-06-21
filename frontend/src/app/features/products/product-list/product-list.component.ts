import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/buyer" class="custom-back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Explore Products</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="product-list-bg">
      <div class="glow-spot glow-1"></div>
      <div class="glow-spot glow-2"></div>
      
      <div class="search-container">
        <div class="custom-searchbar">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterProducts()" placeholder="Search premium products..." class="search-input">
        </div>
      </div>

      <div class="products-grid">
        <div class="product-card" *ngFor="let product of filteredProducts" [routerLink]="['/products', product.id]">
          <div class="product-img-wrapper">
            <img [src]="product.image_url || 'assets/icon/favicon.png'" alt="Product">
            <div class="stock-badge" *ngIf="product.stock < 5 && product.stock > 0">Only {{ product.stock }} left!</div>
            <div class="stock-badge out" *ngIf="product.stock === 0">Out of Stock</div>
          </div>
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-store">{{ product.store?.name || 'Zelive Store' }}</p>
            
            <div class="product-bottom-row">
              <span class="product-price">Rp {{ product.price | number }}</span>
              <button class="quick-add-btn" (click)="addToCart(product, $event)" [disabled]="product.stock === 0">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredProducts.length === 0">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h3>No Products Found</h3>
        <p>Check back later for new arrivals.</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .product-list-bg {
      --background: #08080d;
      position: relative;
    }
    .glow-spot {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      filter: blur(60px);
    }
    .glow-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%);
      top: -50px;
      right: -50px;
    }
    .glow-2 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%);
      bottom: 100px;
      left: -50px;
    }
    
    .glass-toolbar {
      --background: rgba(8, 8, 13, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title {
      font-weight: 700;
      font-size: 1.25rem;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .custom-back-btn {
      color: #94a3b8;
    }

    .search-container {
      padding: 16px 20px 8px 20px;
      position: relative;
      z-index: 10;
    }
    .custom-searchbar {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 0 16px;
      height: 52px;
      transition: all 0.3s ease;
    }
    .custom-searchbar:focus-within {
      background: rgba(255, 255, 255, 0.08);
      border-color: #a855f7;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
    }
    .search-icon {
      color: #64748b;
      margin-right: 12px;
    }
    .search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #f8fafc;
      font-size: 0.95rem;
      height: 100%;
    }
    .search-input::placeholder {
      color: #64748b;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 16px 20px 40px 20px;
      position: relative;
      z-index: 10;
    }
    
    .product-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .product-card:active {
      transform: scale(0.96);
      background: rgba(255, 255, 255, 0.05);
    }
    
    .product-img-wrapper {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: #11111d;
      position: relative;
    }
    .product-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .stock-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 8px;
      backdrop-filter: blur(4px);
    }
    .stock-badge.out {
      background: rgba(100, 116, 139, 0.9);
    }

    .product-info {
      padding: 12px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .product-name {
      color: #f8fafc;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.3;
    }
    .product-store {
      color: #64748b;
      font-size: 0.75rem;
      margin: 0 0 12px 0;
    }
    
    .product-bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .product-price {
      color: #38bdf8;
      font-weight: 800;
      font-size: 0.95rem;
    }
    
    .quick-add-btn {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
      transition: transform 0.2s;
    }
    .quick-add-btn:active {
      transform: scale(0.9);
    }
    .quick-add-btn:disabled {
      background: #334155;
      box-shadow: none;
      color: #64748b;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      color: rgba(255, 255, 255, 0.2);
    }
    .empty-state h3 {
      color: #ffffff;
      font-weight: 700;
      margin: 16px 0 8px 0;
    }
    .empty-state p {
      color: #64748b;
      font-size: 0.95rem;
      margin: 0;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((res: any) => {
      this.products = res.data?.data || res.data || [];
      this.filteredProducts = [...this.products];
    });
  }

  filterProducts() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.store?.name?.toLowerCase().includes(q)
    );
  }

  async addToCart(product: any, event: Event) {
    event.stopPropagation(); // Prevent routing to details
    this.cartService.addToCart(product.id, 1).subscribe({
      next: async (res) => {
        const toast = await this.toastController.create({
          message: `${product.name} added to cart!`,
          duration: 2000,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle'
        });
        await toast.present();
      },
      error: async (err) => {
        const toast = await this.toastController.create({
          message: `Failed: ${err.error?.message || err.message}`,
          duration: 2000,
          color: 'danger',
          position: 'bottom'
        });
        await toast.present();
      }
    });
  }
}
