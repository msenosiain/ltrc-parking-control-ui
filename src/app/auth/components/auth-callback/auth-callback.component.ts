import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.storeToken(token);
        this.router.navigate(['/dashboard']);
      } else {
        this.authService.loginWithGoogle();
      }
    });
  }

}
