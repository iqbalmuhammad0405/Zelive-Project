import { Injectable } from '@angular/core';
// Mock import for Firebase
// import { initializeApp } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor() {
    // initializeApp(environment.firebaseConfig);
  }
  
  async loginWithGoogle() {
    return "mock_google_token";
  }
}
