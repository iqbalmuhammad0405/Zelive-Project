import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buyer-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Buyer Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">Logout</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Welcome back, Buyer!</h2>
      <p>Discover products, join live streams, and manage your cart.</p>
      
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card color="secondary">
              <ion-card-header>
                <ion-card-title>Cart</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                0 Items
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card color="tertiary">
              <ion-card-header>
                <ion-card-title>Wallet</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Rp 0
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <h3>Active Live Streams</h3>
      <ion-list>
        <ion-item button>
          <ion-icon name="videocam" slot="start" color="danger"></ion-icon>
          <ion-label>
            <h2>Tech Gadgets Sale!</h2>
            <p>Seller: GadgetStore</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DashboardPage implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() { }
  logout() { this.router.navigate(['/login']); }
}
