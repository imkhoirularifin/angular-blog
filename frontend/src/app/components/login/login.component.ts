import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {}

  loginForm!: FormGroup;
  isSuccess: boolean = false;
  isFailed: boolean = false;
  statusMessage!: string;

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
      .subscribe({
        next: () => {
          this.isSuccess = true;
          setTimeout(() => {
            this.isSuccess = false;
          }, 5000);
        },
        error: (error) => {
          this.isFailed = true;
          setTimeout(() => {
            this.isFailed = false;
          }, 5000);
          this.statusMessage = error.error.message;
        },
      });
  }
}
