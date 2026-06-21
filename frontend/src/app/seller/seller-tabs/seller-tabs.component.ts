import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, cubeOutline, listOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-seller-tabs',
  standalone: true,
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="custom-tab-bar">
        <ion-tab-button tab="dashboard" href="/seller/dashboard">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="products" href="/seller/products">
          <ion-icon name="cube-outline"></ion-icon>
          <ion-label>Products</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="orders" href="/seller/orders">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Orders</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/seller/profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Store</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    .custom-tab-bar {
      --background: rgba(13, 15, 23, 0.85); /* Navy blue translucent */
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      height: 64px;
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    ion-tab-button {
      --color: #64748b; /* slate-500 */
      --color-selected: #38bdf8; /* sky-400 */
    }
    
    ion-icon {
      font-size: 22px;
      margin-bottom: 2px;
    }
    
    ion-label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
  `]
})
export class SellerTabsComponent {
  constructor() {
    addIcons({ homeOutline, cubeOutline, listOutline, personOutline });
  }
}
