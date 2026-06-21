import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = environment.apiUrl + '/wallet';

  constructor(private http: HttpClient) { }

  getBalance() {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  topup(amount: number) {
    return this.http.post(`${environment.apiUrl}/checkout`, { amount });
  }
}
