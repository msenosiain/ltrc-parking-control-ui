import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {MatSubheaderHarness} from '@angular/material/list/testing';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();
  private authApiUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) { }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  loginWithGoogle() {
    window.location.href = `${this.authApiUrl}/google`;
  }

  storeToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('jwt');
  }

  logout() {
    localStorage.removeItem('jwt');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.authApiUrl}/profile`);
  }
}
