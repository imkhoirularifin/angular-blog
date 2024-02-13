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
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {}

  registerForm!: FormGroup;

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
      .pipe(
        map((result) => {
          console.log(result);
        })
      )
      .subscribe();
  }
}
