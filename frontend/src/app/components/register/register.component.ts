import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../utils/confirm-password.validator';
import { HttpHeaders } from '@angular/common/http';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {}

  registerForm!: FormGroup;
  isSuccess: boolean = false;
  isFailed: boolean = false;
  responseData: any;
  responseHeaders!: HttpHeaders;
  statusMessage!: string;

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: confirmPasswordValidator }
    );
  }

  registerHandler(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    this.authService
      .register(
        form.value.name,
        form.value.username,
        form.value.email,
        form.value.password
      )
      .subscribe({
        next: () => {
          // set this.isSuccess to true for 3 seconds
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
