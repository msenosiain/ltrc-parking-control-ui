import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface RegisterAccessResponse {
  accessGranted: boolean;
  title: string;
  subtitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {

  private accessLogApiUrl = `${environment.apiBaseUrl}/access-log`;

  constructor(private httpClient: HttpClient) {
  }

  registerAccess(dni: string): Observable<RegisterAccessResponse> {
    return this.httpClient.post<RegisterAccessResponse>(`${this.accessLogApiUrl}`, {dni: dni});
  }
}
