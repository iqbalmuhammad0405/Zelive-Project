import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private api: ApiService) {
    const savedUser = this.getUser();
    if (savedUser) {
      this.currentUserSubject.next(savedUser);
    }
  }
  
  getToken() { return localStorage.getItem('token'); }
  getUser() { 
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  login(credentials: any) {
    return this.api.post('auth/login', credentials);
  }
  register(data: any) {
    return this.api.post('auth/register', data);
  }
  registerSeller(data: any) {
    return this.api.post('auth/register-seller', data);
  }
  googleRegister(data: any) {
    return this.api.post('auth/google-register', data);
  }
  googleLogin(data: any) {
    return this.api.post('auth/google', data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}
