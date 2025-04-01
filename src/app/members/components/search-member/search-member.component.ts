import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {Member} from '../../member.interface';
import {MembersService, RegisterAccessResponse} from '../../members.service';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
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
  providers: [MembersService]
})
export class SearchMemberComponent {
  destroyRef = inject(DestroyRef);
  memberNotFoundMessage: string = '';
  registerAccessResponse: RegisterAccessResponse | undefined = undefined;
  searchTerm: string = '';

  constructor(private membersService: MembersService) {
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
      ).subscribe(response => {
        this.registerAccessResponse = response;
      })
    }
  }

  clearAccessResponse() {
    this.registerAccessResponse = undefined;
    this.searchTerm = '';
    this.memberNotFoundMessage = '';
  }
}
