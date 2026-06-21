import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl + '/upload';

  constructor(private http: HttpClient) { }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/avatar`, formData);
  }

  uploadProductImage(productId: string, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/product/${productId}`, formData, {
      reportProgress: true,
      observe: 'events',
      headers: { 'Accept': 'application/json' }
    });
  }
}
