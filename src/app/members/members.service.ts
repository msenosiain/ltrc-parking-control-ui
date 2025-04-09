import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from './member.interface';
import {PaginatedResponse} from '../common/PaginatedResponse';
import {SortDirection} from '@angular/material/sort';

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

  getMembers(page: number = 1, limit: number = 10, sortBy?: string, direction?: SortDirection): Observable<PaginatedResponse<Member>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', limit.toString())
      .set('sortBy', sortBy ?? 'lastName')
      .set('sortOrder', direction ?? 'asc');

    return this.httpClient.get<PaginatedResponse<Member>>(`${this.membersApiUrl}`, {params});
  }
}
