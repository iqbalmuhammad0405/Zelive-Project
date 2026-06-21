import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Platform } from '@ionic/angular';
import { from, lastValueFrom } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private platform: Platform) {}
  
  async postNative(endpoint: string, data: any) {
    if (this.platform.is('capacitor')) {
      const { CapacitorHttp } = await import('@capacitor/core');
      const response = await CapacitorHttp.post({
        url: `${this.baseUrl}/${endpoint}`,
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'User-Agent': navigator.userAgent || 'Mozilla/5.0 (Linux; Android 10; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0'
        },
        data: data // Capacitor 5 properly handles object serialization internally
      });
      if (response.status >= 400) {
        console.error('CapacitorHttp Error Status:', response.status);
        console.error('CapacitorHttp Error Data:', JSON.stringify(response.data));
        
        // Sometimes Capacitor returns a string, sometimes an object. Let's normalize it to match HttpClient's HttpErrorResponse
        let errorBody = response.data;
        if (typeof response.data === 'string') {
          try { errorBody = JSON.parse(response.data); } catch(e) {}
        }
        throw { error: errorBody, status: response.status, message: `HTTP ${response.status}` };
      }
      return response.data;
    } else {
      return lastValueFrom(this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers: { 'Accept': 'application/json' } }));
    }
  }

  get(endpoint: string) { return this.http.get(`${this.baseUrl}/${endpoint}`, { headers: { 'Accept': 'application/json' } }); }
  post(endpoint: string, data: any) { return from(this.postNative(endpoint, data)); }
  put(endpoint: string, data: any) { return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers: { 'Accept': 'application/json' } }); }
  delete(endpoint: string) { return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers: { 'Accept': 'application/json' } }); }
}
