import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {}

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  loginHandler(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    this.authService
      .login(form.value.usernameOrEmail, form.value.password)
      .pipe(
        map((result) => {
          console.log(result.access_token);
        })
      )
      .subscribe();
  }
}
