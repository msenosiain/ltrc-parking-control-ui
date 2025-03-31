import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from './member.interface';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private membersApiUrl = `${environment.apiBaseUrl}/members`;

  constructor(private httpClient: HttpClient) {
  }

  searchMemberByDni(dni: string): Observable<Member> {
    return this.httpClient.get<Member>(`${this.membersApiUrl}/${dni}`);
  }
}
