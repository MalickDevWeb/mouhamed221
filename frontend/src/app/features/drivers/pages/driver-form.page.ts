import { Component, OnInit, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, errorMessage } from '../../../core/http/api-error';
import { FieldErrorComponent } from '../../../shared/forms/field-error.component';
import { applyFieldErrors, compactPhone, senegalPhoneValidator } from '../../../shared/forms/validators';
import { DriverRepository } from '../data/driver.repository';
import { DRIVER_STATUSES, DRIVER_STATUS_LABELS, DriverInput, DriverStatus, SITES } from '../driver.models';

@Component({
  selector: 'app-driver-form-page',
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './driver-form.page.html',
})
export class DriverFormPage implements OnInit {
  /** Paramètre de route : absent en création. */
  readonly id = input<string>();

  private readonly repository = inject(DriverRepository);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group({
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    birthDate: ['', Validators.required],
    phone: ['+221', [Validators.required, senegalPhoneValidator]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    site: ['', Validators.required],
    hireDate: ['', Validators.required],
    status: ['ACTIF' as DriverStatus, Validators.required],
    licenseNumber: ['', [Validators.required, Validators.maxLength(30)]],
    idCardNumber: ['', [Validators.required, Validators.maxLength(30)]],
  });

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly statuses = DRIVER_STATUSES;
  protected readonly statusLabels = DRIVER_STATUS_LABELS;
  protected readonly sites = SITES;

  ngOnInit(): void {
    const id = this.id();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.repository
      .get(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ id: _id, matricule: _matricule, ...driver }) => this.form.setValue({ ...driver, email: driver.email ?? '' }),
        error: (cause: unknown) => this.error.set(errorMessage(cause)),
      });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const input: DriverInput = { ...value, phone: compactPhone(value.phone), email: value.email.trim() || null };
    const id = this.id();

    this.saving.set(true);
    this.error.set(null);
    (id ? this.repository.update(id, input) : this.repository.create(input))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (driver) => void this.router.navigate(['/chauffeurs', driver.id]),
        error: (cause: unknown) => {
          this.error.set(errorMessage(cause));
          if (cause instanceof ApiError) {
            applyFieldErrors(this.form, cause.fieldErrors);
          }
        },
      });
  }
}
