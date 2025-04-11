import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {jwtDecode} from 'jwt-decode';

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
      map((params) => {
        return params['token'];
      })
    ).subscribe((token) => {
        if (token) {
          this.authService.storeToken(token);
          const user = jwtDecode(token);
          this.authService.setUser(user);
          this.router.navigate(['/dashboard']);
        } else {
          this.authService.loginWithGoogle();
        }
      }
    );
  }

}
