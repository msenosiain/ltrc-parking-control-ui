import {Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {catchError, of} from 'rxjs';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {MembersService, RegisterAccessResponse} from '../../members.service';

@Component({
  selector: 'ltrc-search-member',
  templateUrl: './search-member.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  styleUrl: './search-member.component.scss',
  providers: [provideNgxMask(), MembersService]
})
export class SearchMemberComponent {
  destroyRef = inject(DestroyRef);
  memberNotFoundMessage: string = '';
  registerAccessResponse: RegisterAccessResponse | undefined = undefined;
  dni = new FormControl('', [Validators.required, Validators.pattern(/^\d{7,8}$/)]);

  constructor(private membersService: MembersService) {
  }

  search() {
    const value = this.dni.value;
    if (this.dni.valid && value) {
      this.membersService.searchMemberByDni(value).pipe(
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

  reset() {
    this.registerAccessResponse = undefined;
    this.dni.reset();
    this.memberNotFoundMessage = '';
  }
}
