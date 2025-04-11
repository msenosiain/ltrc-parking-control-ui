import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map, switchMap, tap} from 'rxjs';

@Component({
  selector: 'ltrc-auth-callback',
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.scss'
})
export class AuthCallbackComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((params) => {
        const token = params['token'];
        if (token) {
          this.authService.storeToken(token);
        } else {
          this.authService.loginWithGoogle();
        }
      }),
      switchMap(() => {
        return this.authService.getProfile();
      })
    ).subscribe((userProfile) => {
      this.authService.setUser(userProfile);
        this.router.navigate(['/dashboard']);
      }
    );
  }

}
