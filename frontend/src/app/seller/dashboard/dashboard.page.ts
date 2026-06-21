import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Seller Dashboard</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">Logout</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Your Store: MyAwesomeShop</h2>
      
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card color="success">
              <ion-card-header>
                <ion-card-title>Revenue</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Rp 1.500.000
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card color="warning">
              <ion-card-header>
                <ion-card-title>Orders</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                12 Pending
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <ion-button expand="block" color="danger" class="ion-margin-top">
        <ion-icon name="radio" slot="start"></ion-icon>
        Start Live Stream
      </ion-button>
      
      <h3>Product Management</h3>
      <ion-list>
        <ion-item button>
          <ion-label>Add New Product</ion-label>
        </ion-item>
        <ion-item button>
          <ion-label>Manage Inventory</ion-label>
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
