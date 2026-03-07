import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { User } from 'oidc-client';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.css']
})
export class AccountMenuComponent {
  private authService = inject(AuthService);

  user$: BehaviorSubject<User | null> = this.authService.user$;
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => user !== null && !user.expired));

  login() {
    this.authService.login().subscribe();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
