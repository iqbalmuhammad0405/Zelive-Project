import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'google-register',
    loadComponent: () => import('./auth/google-register/google-register.component').then( m => m.GoogleRegisterComponent)
  },
  {
    path: 'register-buyer',
    loadComponent: () => import('./auth/register-buyer/register-buyer.component').then( m => m.RegisterBuyerComponent)
  },
  {
    path: 'register-seller',
    loadComponent: () => import('./auth/register-seller/register-seller.component').then( m => m.RegisterSellerComponent)
  },
  {
    path: 'buyer',
    canActivate: [AuthGuard],
    loadComponent: () => import('./buyer/dashboard/buyer-dashboard.component').then( m => m.BuyerDashboardComponent)
  },
  {
    path: 'seller',
    canActivate: [AuthGuard],
    loadChildren: () => import('./seller/seller.routes').then( m => m.routes)
  },
  {
    path: 'products',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/products/product-list/product-list.component').then( m => m.ProductListComponent)
  },
  {
    path: 'cart',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/cart/cart.component').then( m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/checkout/checkout.component').then( m => m.CheckoutComponent)
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/chat/chat-room/chat-room.page').then( m => m.ChatRoomPage)
  },
  {
    path: 'live-room',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/live-room/live-room.component').then( m => m.LiveRoomComponent)
  },
  {
    path: 'wallet',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/wallet/wallet.component').then( m => m.WalletComponent)
  },
  {
    path: 'products/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then( m => m.ProductDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/profile.component').then( m => m.ProfileComponent)
  }
];
