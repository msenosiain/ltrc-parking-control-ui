import {Routes} from '@angular/router';
import {authGuard} from './auth/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SearchMemberComponent} from './members/components/search-member/search-member.component';
import {AuthCallbackComponent} from './auth/components/auth-callback/auth-callback.component';

export const routes: Routes = [
  {path: 'auth/callback', component: AuthCallbackComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {
    path: '',
    component: SearchMemberComponent,
  }
];
