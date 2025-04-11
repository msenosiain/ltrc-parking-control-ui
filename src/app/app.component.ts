import {AfterViewInit, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AuthService} from './auth/auth.service';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {Observable} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'ltrc-root',
  imports: [CommonModule, RouterOutlet, MatButtonModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  destroyRef = inject(DestroyRef);

  title = 'Estacionamiento LTRC';
  user$: Observable<any>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  ngAfterViewInit() {
    this.authService.getProfile().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      profile => {
        this.authService.setUser(profile);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
