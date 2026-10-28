import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { errorMessage } from '../../core/http/api-error';
import { DEMO_PASSWORD, DEMO_USERS } from '../../mock/repositories/memory-auth.gateway';
import { FieldErrorComponent } from '../../shared/forms/field-error.component';
import { ROLE_LABELS } from '../../core/auth/roles';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FieldErrorComponent],
  templateUrl: './login.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  /** Paramètre de requête fourni par authGuard. */
  readonly returnUrl = input<string>('/dashboard');

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly demoMode = environment.useMockApi;
  protected readonly demoUsers = DEMO_USERS;
  protected readonly demoPassword = DEMO_PASSWORD;
  protected readonly roleLabels = ROLE_LABELS;

  protected fillDemo(email: string): void {
    this.form.setValue({ email, password: DEMO_PASSWORD });
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
        next: () => void this.router.navigateByUrl(this.returnUrl() || '/dashboard'),
        error: (cause: unknown) => this.error.set(errorMessage(cause)),
      });
  }
}
