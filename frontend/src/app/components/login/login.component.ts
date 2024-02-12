import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private readonly authService: AuthService) {}

  email: string = 'arifin@gmail.com';
  password: string = '167916';

  loginHandler(email: string, password: string) {
    this.authService
      .login(email, password)
      .pipe()
      .subscribe({
        next: (res) => {
          console.log(res);
        },
      });
  }
}
