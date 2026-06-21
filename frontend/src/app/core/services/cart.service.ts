import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private apiService: ApiService) {}

  getCart(): Observable<any> {
    return this.apiService.get('cart');
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.apiService.post('cart', { product_id: productId, quantity });
  }

  updateCartItem(itemId: string, quantity: number): Observable<any> {
    return this.apiService.put(`cart/${itemId}`, { quantity });
  }

  removeFromCart(itemId: string): Observable<any> {
    return this.apiService.delete(`cart/${itemId}`);
  }

  checkout(): Observable<any> {
    return this.apiService.post('checkout', {});
  }
}
