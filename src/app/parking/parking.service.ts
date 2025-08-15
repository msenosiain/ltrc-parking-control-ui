// parking.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private totalSpaces = environment.totalSpaces;
  private occupiedSpaces = 0;

  // Observable para que el componente se suscriba y reciba actualizaciones
  private availableSpacesSubject = new BehaviorSubject<number>(this.totalSpaces);
  availableSpaces$ = this.availableSpacesSubject.asObservable();

  constructor() {}

  // Intentar estacionar un auto
  parkCar(): boolean {
    if (this.occupiedSpaces < this.totalSpaces) {
      this.occupiedSpaces++;
      this.updateAvailableSpaces();
      return true;
    } else {
      return false; // No hay lugar
    }
  }

  // Registrar salida de un auto
  leaveCar(): boolean {
    if (this.occupiedSpaces > 0) {
      this.occupiedSpaces--;
      this.updateAvailableSpaces();
      return true;
    } else {
      return false; // No hay autos para salir
    }
  }

  // Actualiza el observable
  private updateAvailableSpaces() {
    this.availableSpacesSubject.next(this.totalSpaces - this.occupiedSpaces);
  }
}
