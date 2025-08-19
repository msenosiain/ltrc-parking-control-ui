// parking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from '../../environments/environment';

export interface ParkingStatus {
  total: number;
  occupied: number;
  available: number;
}

@Injectable({ providedIn: 'root' })
export class ParkingService {
  private parkingApiUrl = `${environment.apiBaseUrl}/parking`;

  // BehaviorSubject mantiene el último valor y lo emite a nuevos subscriptores
  private parkingStatusSubject = new BehaviorSubject<ParkingStatus | null>(null);

  // Observable expuesto al resto de la app
  parkingStatus$: Observable<ParkingStatus | null> = this.parkingStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStatus(); // carga inicial
  }

  /** Cargar estado inicial desde el backend */
  loadStatus() {
    this.http.get<ParkingStatus>(`${this.parkingApiUrl}/status`).subscribe(status => {
      this.parkingStatusSubject.next(status);
    });
  }

  /** Auto entra */
  carEnters() {
    this.http.post<ParkingStatus>(`${this.parkingApiUrl}/enter`, {}).subscribe(status => {
      this.parkingStatusSubject.next(status);
    });
  }

  /** Auto sale */
  carLeaves() {
    this.http.post<ParkingStatus>(`${this.parkingApiUrl}/leave`, {}).subscribe(status => {
      this.parkingStatusSubject.next(status);
    });
  }
}
