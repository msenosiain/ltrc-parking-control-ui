import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {Member} from '../../member.interface';
import {MembersService} from '../../members.service';
import {CommonModule} from '@angular/common';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'ltrc-search-member',
  templateUrl: './search-member.component.html',
  imports: [
    FormsModule,
    CommonModule,
    MatCard,
    MatIcon,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
  ],
  styleUrl: './search-member.component.scss',
  providers: [MembersService]
})
export class SearchMemberComponent {
  destroyRef = inject(DestroyRef);
  member: Member | undefined;
  searchTerm: string = '';

  constructor(private membersService: MembersService) {
  }

  search() {
    if (this.searchTerm) {
      this.membersService.searchMemberByDni(this.searchTerm).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(
        (member: Member) => {
          this.member = member;
        }
      )
    }
  }
}
