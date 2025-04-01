import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from './member.interface';

export interface RegisterAccessResponse {
  accessGranted: boolean;
  member: Member;
  title: string;
  subtitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private membersApiUrl = `${environment.apiBaseUrl}/members`;

  constructor(private httpClient: HttpClient) {
  }

  searchMemberByDni(dni: string): Observable<RegisterAccessResponse> {
    return this.httpClient.get<RegisterAccessResponse>(`${this.membersApiUrl}/${dni}`);
  }
}
