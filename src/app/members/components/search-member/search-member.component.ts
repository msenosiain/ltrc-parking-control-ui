import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Member} from '../../member.interface';
import {MembersService} from '../../members.service';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AccessLogService, RegisterAccessResponse} from '../../../access-log/access-log.service';
import {catchError, of} from 'rxjs';

@Component({
  selector: 'ltrc-search-member',
  templateUrl: './search-member.component.html',
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  styleUrl: './search-member.component.scss',
  providers: [MembersService, AccessLogService]
})
export class SearchMemberComponent {
  destroyRef = inject(DestroyRef);
  member: Member | undefined = undefined;
  memberNotFoundMessage: string = '';
  registerAccessResponse: RegisterAccessResponse | undefined = undefined;
  searchTerm: string = '';

  constructor(private membersService: MembersService,
              private accessLogService: AccessLogService) {
  }

  search() {
    if (this.searchTerm) {
      this.membersService.searchMemberByDni(this.searchTerm).pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
            console.error('Error:', err);
          this.memberNotFoundMessage = err.error.message;
            return of(undefined);
          }
        )
      ).subscribe(member => this.member = member)
    }
  }

  allow(dni: string) {
    if (dni) {
      this.accessLogService.registerAccess(dni).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(registerAccessResponse => {
          this.registerAccessResponse = registerAccessResponse;
          this.clearMember();
        }
      )
    }
  }

  cancel() {
    this.clearMember();
  }

  acknowledge() {
    this.clearMember();
    this.registerAccessResponse = undefined;

  }

  private clearMember() {
    this.member = undefined;
    this.searchTerm = '';
    this.memberNotFoundMessage = '';
  }
}
