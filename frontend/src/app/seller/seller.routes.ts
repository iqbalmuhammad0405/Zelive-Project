import { Routes } from '@angular/router';
import { SellerTabsComponent } from './seller-tabs/seller-tabs.component';

export const routes: Routes = [
  {
    path: '',
    component: SellerTabsComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./products/seller-products.component').then(m => m.SellerProductsComponent)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./products/add-product/seller-add-product.component').then(m => m.SellerAddProductComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./products/edit-product/seller-edit-product.component').then(m => m.SellerEditProductComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/seller-orders.component').then(m => m.SellerOrdersComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/seller-profile.component').then(m => m.SellerProfileComponent)
      },
      {
        path: 'profile/settings',
        loadComponent: () => import('./profile/settings/store-settings.component').then(m => m.StoreSettingsComponent)
      },
      {
        path: 'profile/history',
        loadComponent: () => import('./profile/history/live-history.component').then(m => m.LiveHistoryComponent)
      },
      {
        path: 'profile/revenue',
        loadComponent: () => import('./profile/revenue/seller-revenue.component').then(m => m.SellerRevenueComponent)
      }
    ]
  }
];
