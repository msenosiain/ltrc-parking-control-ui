import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AuthService} from './auth/auth.service';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'ltrc-root',
  imports: [CommonModule, RouterOutlet, MatButtonModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'Estacionamiento LTRC';
  user$!: Observable<any>;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    const token = this.authService.getAuthToken()
    if (token) {
      const user = jwtDecode(token);
      this.authService.setUser(user);
      this.user$ = this.authService.user$;
      this.cd.markForCheck();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
