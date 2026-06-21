import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, AlertController, ToastController } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-title class="brand-title">My Products</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="page-wrapper">
        <div class="empty-state" *ngIf="products.length === 0 && !loading">
          <div class="empty-icon-circle">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <h3>No Products Yet</h3>
          <p>Tap the + button to add your first product and start selling.</p>
        </div>
        
        <div class="product-list" *ngIf="products.length > 0">
          <div class="product-card" *ngFor="let product of products">
            <div class="product-img">
              <img [src]="product.image_url || 'assets/placeholder-product.png'" alt="Product Image">
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <p class="product-price">Rp {{ product.price | number }}</p>
              <div class="product-meta">
                <span class="stock-badge">Stock: {{ product.stock }}</span>
              </div>
            </div>
            <div class="product-actions">
              <button class="action-btn edit-btn" (click)="editProduct(product.id)">
                <ion-icon name="create-outline"></ion-icon>
              </button>
              <button class="action-btn delete-btn" (click)="confirmDelete(product)">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="custom-fab" (click)="navigateToAddProduct()">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
      --padding-bottom: 16px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: -0.5px;
      color: #ffffff;
      padding-left: 12px;
      padding-top: 12px;
    }
    
    .page-wrapper {
      padding: 24px 20px;
      max-width: 600px;
      margin: 0 auto;
      min-height: 100%;
      padding-bottom: 100px; /* Space for FAB */
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
    
    .product-list {
      display: flex; flex-direction: column; gap: 16px;
    }
    .product-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .product-img {
      width: 64px; height: 64px; border-radius: 12px; background: #1e293b; overflow: hidden;
      flex-shrink: 0;
    }
    .product-img img { width: 100%; height: 100%; object-fit: cover; }
    .product-info { display: flex; flex-direction: column; gap: 4px; flex-grow: 1; }
    .product-name { font-size: 1rem; font-weight: 600; color: #f8fafc; margin: 0; }
    .product-price { font-size: 0.95rem; font-weight: 700; color: #38bdf8; margin: 0; }
    .stock-badge {
      font-size: 0.75rem; background: rgba(56, 189, 248, 0.1); color: #7dd3fc;
      padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.2);
      width: fit-content;
    }
    
    .custom-fab {
      --background: #0284c7; /* Sky 600 */
      --background-hover: #0369a1;
      --box-shadow: 0 8px 24px rgba(2, 132, 199, 0.4);
      margin-bottom: 16px;
      margin-right: 8px;
    }
    
    .product-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .edit-btn {
      background: rgba(56, 189, 248, 0.1);
      color: #38bdf8;
    }
    .edit-btn:active { background: rgba(56, 189, 248, 0.2); transform: scale(0.95); }
    
    .delete-btn {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    .delete-btn:active { background: rgba(239, 68, 68, 0.2); transform: scale(0.95); }
  `]
})
export class SellerProductsComponent implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ add, createOutline, trashOutline });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ionViewWillEnter() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.apiService.get('seller/products').subscribe({
      next: (res: any) => {
        this.products = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
        this.loading = false;
      }
    });
  }

  navigateToAddProduct() {
    this.router.navigate(['/seller/products/add']);
  }

  editProduct(id: string | number) {
    this.router.navigate(['/seller/products/edit', id]);
  }

  async confirmDelete(product: any) {
    const alert = await this.alertController.create({
      header: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { 
          text: 'Delete', 
          role: 'destructive',
          handler: () => {
            this.deleteProduct(product.id);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteProduct(id: string | number) {
    this.apiService.delete(`products/${id}`).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Product deleted successfully',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        toast.present();
        this.loadProducts();
      },
      error: async (err) => {
        const toast = await this.toastController.create({
          message: 'Failed to delete product',
          duration: 2000,
          color: 'danger',
          position: 'bottom'
        });
        toast.present();
      }
    });
  }
}
