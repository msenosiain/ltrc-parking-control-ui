import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {MatSubheaderHarness} from '@angular/material/list/testing';
import {BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  private authApiUrl = `${environment.apiBaseUrl}/auth/google`;

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  loginWithGoogle() {
    window.location.href = this.authApiUrl;
  }

  storeToken(token: string) {
    localStorage.setItem('jwt', token);
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  getAuthToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }
}
