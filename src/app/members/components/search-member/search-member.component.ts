import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {catchError, Observable, of} from 'rxjs';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {MembersService, RegisterAccessResponse} from '../../members.service';
import {Member} from '../../member.interface';
import {AccessLogService} from '../../../access-log/access-log.service';
import {ParkingService, ParkingStatus} from '../../../parking/parking.service';
import {environment} from '../../../../environments/environment';

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
export class SearchMemberComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  member: Member | undefined;
  memberNotFoundMessage: string = '';
  registerAccessResponse: RegisterAccessResponse | undefined = undefined;
  dni = new FormControl('', [Validators.required, Validators.pattern(/^\d{7,8}$/)]);
  parkingStatus$: Observable<ParkingStatus | null>;
  totalSpaces = environment.totalSpaces

  constructor(private membersService: MembersService,
              private accessLogService: AccessLogService,
              private parkingService: ParkingService) {
    this.parkingStatus$ = this.parkingService.parkingStatus$;
  }

  ngOnInit() {
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
      ).subscribe(member => this.member = member)
    }
  }

  allow() {
    if (!this.member || !this.member.dni) {
      return;
    }
    this.accessLogService.registerAccess(this.member.dni).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(registerAccessResponse => {
        this.registerAccessResponse = registerAccessResponse;
        if (registerAccessResponse.accessGranted) {
          this.parkingService.carEnters();
        }
        this.clearMember();
      }
    )

  }

  cancel() {
    this.clearMember();
  }

  acknowledge() {
    this.clearMember();
    this.registerAccessResponse = undefined;
  }

  carLeft() {
    this.parkingService.carLeaves();

  }

  private clearMember() {
    this.member = undefined;
    this.dni.reset();
    this.memberNotFoundMessage = '';
  }
}
