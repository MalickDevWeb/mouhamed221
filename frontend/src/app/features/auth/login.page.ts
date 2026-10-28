import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { errorMessage } from '../../core/http/api-error';
import { DEMO_PASSWORD, DEMO_USERS } from '../../mock/repositories/memory-auth.gateway';
import { ROLE_LABELS } from '../../core/auth/roles';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly returnUrl = input<string>('/dashboard');

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['admin@kai.demo', [Validators.required, Validators.email]],
    password: [DEMO_PASSWORD, Validators.required],
  });
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly demoMode = environment.useMockApi;
  protected readonly demoUsers = DEMO_USERS;
  protected readonly demoPassword = DEMO_PASSWORD;
  protected readonly roleLabels = ROLE_LABELS;

  protected togglePassword(): void {
    this.showPassword.update((s) => !s);
  }

  protected onDemoRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value;
    const emails: Record<string, string> = {
      admin: 'admin@kai.demo',
      manager: 'parc@kai.demo',
      technician: 'tech@kai.demo',
      supervisor: 'superviseur@kai.demo',
      reader: 'lecture@kai.demo',
    };
    const email = emails[role] || 'admin@kai.demo';
    this.form.patchValue({ email, password: DEMO_PASSWORD });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          const target = this.returnUrl();
          const destination = !target || target === '/login' ? '/dashboard' : target;
          void this.router.navigateByUrl(destination);
        },
        error: (cause: unknown) => this.error.set(errorMessage(cause)),
      });
  }
}
