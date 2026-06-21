import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../../core/services/api.service';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonSelect, IonSelectOption],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar class="glass-toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/seller/products" class="custom-back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="brand-title">Add New Product</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="navy-dashboard-bg">
      <div class="form-wrapper">
        <div class="form-container">
          
          <div class="field-container">
            <label class="field-label">Product Name</label>
            <div class="input-group">
              <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <input type="text" [(ngModel)]="newProduct.name" placeholder="e.g. Cyberpunk Sneaker" class="custom-input">
            </div>
          </div>
          
          <div class="form-row">
            <div class="field-container flex-1">
              <label class="field-label">Price</label>
              <div class="input-group">
                <span class="currency-prefix">Rp</span>
                <input type="number" inputmode="numeric" [(ngModel)]="newProduct.price" placeholder="0" class="custom-input" min="0">
              </div>
            </div>
            <div class="field-container flex-1">
              <label class="field-label">Stock Qty</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <input type="number" inputmode="numeric" [(ngModel)]="newProduct.stock" placeholder="0" class="custom-input" min="0">
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-container flex-1">
              <label class="field-label">Category</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
                <select [(ngModel)]="newProduct.category_id" class="custom-input custom-native-select">
                  <option [ngValue]="null" disabled selected>{{ isLoadingCategories ? 'Memuat kategori...' : 'Pilih Kategori...' }}</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="field-container">
            <label class="field-label">Description</label>
            <div class="input-group textarea-group">
              <svg class="input-icon textarea-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="14" y1="18" x2="3" y2="18"></line>
              </svg>
              <textarea [(ngModel)]="newProduct.description" placeholder="Write a catchy product description..." class="custom-input" rows="4"></textarea>
            </div>
          </div>

          <div class="field-container">
            <label class="field-label">Product Image</label>
            <div class="upload-zone" [class.has-file]="!!selectedFile" (click)="fileInput.click()">
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display:none">
              
              <div class="upload-icon-circle">
                <svg *ngIf="!selectedFile" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <svg *ngIf="selectedFile" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              
              <div class="upload-text">
                <h4 *ngIf="!selectedFile">Click to upload image</h4>
                <h4 *ngIf="selectedFile">{{ selectedFile.name }}</h4>
                <p *ngIf="!selectedFile">PNG, JPG, GIF up to 5MB</p>
                <p *ngIf="selectedFile" style="color: #38bdf8;">Ready to upload</p>
              </div>
            </div>
          </div>

          <button class="submit-btn" (click)="processPublishProduct()" [disabled]="isSubmitting">
            <span *ngIf="!isSubmitting">Publish Product</span>
            <div class="spinner-container" *ngIf="isSubmitting && !isUploading" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <div class="spinner"></div>
            </div>
            <div class="progress-container" *ngIf="isUploading" style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <div class="progress-bar-bg" style="width: 80%; height: 6px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
                <div class="progress-bar-fill" [style.width.%]="uploadProgress" style="height: 100%; background: #38bdf8; transition: width 0.3s ease;"></div>
              </div>
              <span class="progress-text" style="font-size: 12px; font-weight: 500;">Uploading {{ uploadProgress }}%</span>
            </div>
          </button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .navy-dashboard-bg {
      --background: #0B1120;
    }
    .glass-toolbar {
      --background: rgba(11, 17, 32, 0.7);
      --border-width: 0;
      --padding-top: max(env(safe-area-inset-top, 20px), 32px);
      --padding-bottom: 16px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .brand-title {
      font-weight: 700;
      font-size: 1.25rem;
      color: #ffffff;
    }
    .custom-back-btn {
      color: #94a3b8;
    }
    
    .form-wrapper {
      padding: 24px 20px 40px 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .form-container {
      display: flex; flex-direction: column; gap: 24px;
    }
    
    .form-row { display: flex; gap: 16px; }
    .flex-1 { flex: 1; }
    .field-container { display: flex; flex-direction: column; gap: 10px; }
    .field-label {
      font-size: 0.9rem; font-weight: 600; color: #cbd5e1; margin-left: 4px;
    }
    
    /* Depth UI for Input Group */
    .input-group {
      background: rgba(30, 41, 59, 0.5); /* Elevated Navy Blue background for depth */
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      display: flex; align-items: center; padding: 0 16px; height: 56px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .input-group:focus-within {
      background: rgba(30, 41, 59, 0.8);
      border-color: #0ea5e9;
      box-shadow: 0 4px 20px rgba(14, 165, 233, 0.15), 0 0 0 3px rgba(14, 165, 233, 0.1);
    }
    
    .input-icon { color: #64748b; flex-shrink: 0; margin-right: 12px; transition: color 0.3s ease; }
    .input-group:focus-within .input-icon { color: #38bdf8; }
    
    .currency-prefix {
      color: #64748b; font-weight: 600; margin-right: 12px; font-size: 1rem; transition: color 0.3s ease;
    }
    .input-group:focus-within .currency-prefix { color: #38bdf8; }
    
    .textarea-group { height: auto; padding: 16px; align-items: flex-start; }
    .textarea-icon { margin-top: 2px; }
    
    .custom-input {
      flex: 1; width: 100%; height: 100%; background: transparent; border: none; outline: none;
      color: #f8fafc; font-size: 1rem; font-family: inherit; padding: 0;
    }
    .custom-input::placeholder { color: #64748b; font-weight: 400; }
    textarea.custom-input { resize: vertical; line-height: 1.6; min-height: 100px; }
    
    .custom-ion-select {
      width: 100%;
      --padding-start: 0;
      color: #f8fafc;
      font-size: 0.95rem;
    }
    .custom-ion-select::part(placeholder) {
      color: #64748b;
      opacity: 1;
    }
    .custom-ion-select::part(icon) {
      display: none; /* Hide default icon since we use our custom SVG */
    }
    
    .custom-native-select {
      appearance: none;
      -webkit-appearance: none;
      background-color: transparent;
      color: #f8fafc;
      width: 100%;
      border: none;
      outline: none;
      font-family: inherit;
      font-size: 0.95rem;
      cursor: pointer;
    }
    .custom-native-select option {
      background-color: #1E2230;
      color: #f8fafc;
      padding: 10px;
    }
    
    .upload-zone {
      background: rgba(30, 41, 59, 0.5);
      border: 2px dashed rgba(14, 165, 233, 0.3);
      border-radius: 16px; padding: 32px 20px; text-align: center;
      display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer;
      transition: all 0.3s ease;
    }
    .upload-zone:hover { border-color: rgba(14, 165, 233, 0.6); background: rgba(30, 41, 59, 0.7); }
    .upload-zone:active { transform: scale(0.98); }
    .upload-icon-circle {
      width: 56px; height: 56px; border-radius: 50%; background: rgba(14, 165, 233, 0.1);
      display: flex; align-items: center; justify-content: center; color: #0ea5e9;
    }
    .upload-zone.has-file .upload-icon-circle { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .upload-text { display: flex; flex-direction: column; gap: 4px; }
    .upload-text h4 { margin: 0; color: #e2e8f0; font-size: 0.95rem; font-weight: 600; }
    .upload-text p { margin: 0; color: #64748b; font-size: 0.8rem; }
    
    .submit-btn {
      width: 100%; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); /* Sky blue gradient */
      color: #ffffff; font-size: 1.05rem; font-weight: 700; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease; margin-top: 12px; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3);
    }
    .submit-btn:active { transform: scale(0.98); box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2); }
    .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .spinner {
      width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%; border-top-color: #ffffff; animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SellerAddProductComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  newProduct = {
    name: '',
    price: null as number | null,
    stock: null as number | null,
    category_id: null as number | null,
    description: ''
  };

  selectedFile: File | null = null;
  fileName: string = '';
  previewUrl: string | null = null;

  isSubmitting = false;
  isUploading = false;
  uploadProgress = 0;
  categories: any[] = [];
  isLoadingCategories = true;

  constructor(
    private apiService: ApiService,
    private uploadService: UploadService,
    private toastCtrl: ToastController,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  ionViewWillEnter() {
    if (this.categories.length === 0) {
      this.loadCategories();
    }
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.apiService.get('categories').subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
        this.isLoadingCategories = false;
        if (this.categories.length === 0) {
          console.warn("Categories API returned empty data. Using defaults.");
          this.categories = [
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Fashion' },
            { id: 3, name: 'Beauty' },
            { id: 4, name: 'Home & Living' }
          ];
        }
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.isLoadingCategories = false;
        this.categories = [
          { id: 1, name: 'Electronics' },
          { id: 2, name: 'Fashion' },
          { id: 3, name: 'Beauty' },
          { id: 4, name: 'Home & Living' }
        ];
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.showSnackbar('File harus berupa gambar (JPG/PNG/WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showSnackbar('Ukuran gambar maksimal 5MB');
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.fileName = '';
    this.previewUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.cdr.detectChanges();
  }

  async showSnackbar(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'warning',
      position: 'top'
    });
    await toast.present();
  }

  async showSuccess(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  async showError(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      color: 'danger',
      position: 'top',
      buttons: [
        {
          text: 'Tutup',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  processPublishProduct() {
    // Parsing string values back to numbers from text inputs
    const parsedPrice = this.newProduct.price != null ? Number(this.newProduct.price) : null;
    const parsedStock = this.newProduct.stock != null ? Number(this.newProduct.stock) : null;

    if (!this.newProduct.name || this.newProduct.name.trim() === '') {
      this.showSnackbar("Nama produk tidak boleh kosong!");
      return;
    }

    if (parsedPrice === null || isNaN(parsedPrice) || parsedPrice <= 0 ||
        parsedStock === null || isNaN(parsedStock) || parsedStock <= 0) {
      this.showSnackbar("Harga dan Stok harus berupa angka lebih besar dari 0!");
      return;
    }

    if (!this.newProduct.category_id) {
      this.showSnackbar("Silakan pilih kategori produk!");
      return;
    }

    if (!this.selectedFile) {
      this.showSnackbar("Silakan pilih dan unggah foto produk terlebih dahulu!");
      return;
    }

    // Set parsed values back
    this.newProduct.price = parsedPrice;
    this.newProduct.stock = parsedStock;

    // Jika lolos validasi, jalankan fungsi upload
    this.createProduct();
  }

  private setSubmittingState(isSubmitting: boolean) {
    this.isSubmitting = isSubmitting;
    if (!isSubmitting) {
      this.isUploading = false;
      this.uploadProgress = 0;
    }
    this.cdr.detectChanges();
  }

  private createProduct() {
    if (this.isSubmitting) return;
    this.setSubmittingState(true);
    
    this.apiService.post('products', this.newProduct).subscribe({
      next: (res: any) => {
        try {
          if (!res || !res.data || !res.data.id) {
            throw new Error('Invalid API response from create product');
          }
          const productId = res.data.id;
          if (this.selectedFile) {
            this.isUploading = true;
            this.cdr.detectChanges();
            
            this.uploadService.uploadProductImage(productId, this.selectedFile).subscribe({
              next: async (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.uploadProgress = Math.round((100 * event.loaded) / (event.total || 1));
                  this.cdr.detectChanges();
                } else if (event.type === HttpEventType.Response) {
                  this.setSubmittingState(false);
                  await this.showSuccess('Product and image saved successfully!');
                  this.location.back(); // Go back to products list
                }
              },
              error: (err) => {
                console.error('Image upload failed', err);
                this.setSubmittingState(false);
                let msg = 'Product created, but image upload failed.';
                if (err.error && err.error.message) {
                  msg += ' Reason: ' + err.error.message;
                }
                this.showError(msg);
                this.location.back();
              }
            });
          } else {
            // No file selected, just finish
            this.setSubmittingState(false);
            this.showSuccess('Product saved successfully!');
            this.location.back();
          }
        } catch (e: any) {
          console.error(e);
          this.setSubmittingState(false);
          this.showError('Something went wrong processing product response: ' + e.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.setSubmittingState(false);
        let msg = 'Failed to create product.';
        if (err.error && err.error.message) {
          msg = err.error.message;
        } else if (err.message) {
          msg = err.message;
        }
        this.showError(msg);
      }
    });
  }
}
