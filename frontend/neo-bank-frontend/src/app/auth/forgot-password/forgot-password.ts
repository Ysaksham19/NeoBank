import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  form: FormGroup;
  loading  = signal(false);
  success  = signal('');
  errorMsg = signal('');

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    this.http.post(`${environment.apiUrl}/auth/forgot-password`, this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('If that email is registered, a reset link has been sent.');
      },
      error: () => {
        this.loading.set(false);
        this.success.set('If that email is registered, a reset link has been sent.');
      }
    });
  }
}
