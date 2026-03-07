import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login-callback',
  standalone: true,
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {

  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.loginCallback().subscribe();
  }

}
