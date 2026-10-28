import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiError, errorMessage } from '../../../core/http/api-error';
import { FieldErrorComponent } from '../../../shared/forms/field-error.component';
import { applyFieldErrors, imeiValidator } from '../../../shared/forms/validators';
import { EquipmentRepository } from '../data/equipment.repository';
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_CONDITION_LABELS,
  EquipmentCategory,
  EquipmentCondition,
  EquipmentInput,
} from '../equipment.models';

@Component({
  selector: 'app-equipment-form-page',
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './equipment-form.page.html',
})
export class EquipmentFormPage implements OnInit {
  readonly id = input<string>();

  private readonly repository = inject(EquipmentRepository);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(NonNullableFormBuilder).group({
    category: ['TELEPHONE' as EquipmentCategory, Validators.required],
    brand: ['', [Validators.required, Validators.maxLength(60)]],
    model: ['', [Validators.required, Validators.maxLength(60)]],
    serialNumber: ['', [Validators.required, Validators.maxLength(60)]],
    imei: ['', [Validators.required, imeiValidator]],
    acquisitionDate: [''],
    warrantyEndDate: [''],
    condition: ['NEUF' as EquipmentCondition, Validators.required],
  });

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isPhone = signal(true);

  protected readonly categories = EQUIPMENT_CATEGORIES;
  protected readonly categoryLabels = EQUIPMENT_CATEGORY_LABELS;
  protected readonly conditions = EQUIPMENT_CONDITIONS;
  protected readonly conditionLabels = EQUIPMENT_CONDITION_LABELS;

  ngOnInit(): void {
    // L'IMEI n'est obligatoire que pour un téléphone.
    this.form.controls.category.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((category) => this.toggleImei(category));

    const id = this.id();
    if (!id) {
      return;
    }
    this.loading.set(true);
    this.repository
      .get(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (equipment) =>
          this.form.setValue({
            category: equipment.category,
            brand: equipment.brand,
            model: equipment.model,
            serialNumber: equipment.serialNumber,
            imei: equipment.imei ?? '',
            acquisitionDate: equipment.acquisitionDate ?? '',
            warrantyEndDate: equipment.warrantyEndDate ?? '',
            condition: equipment.condition,
          }),
        error: (cause: unknown) => this.error.set(errorMessage(cause)),
      });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const input: EquipmentInput = {
      ...value,
      serialNumber: value.serialNumber.trim(),
      imei: value.category === 'TELEPHONE' ? value.imei.trim() : null,
      acquisitionDate: value.acquisitionDate || null,
      warrantyEndDate: value.warrantyEndDate || null,
    };
    const id = this.id();

    this.saving.set(true);
    this.error.set(null);
    (id ? this.repository.update(id, input) : this.repository.create(input))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/equipements']),
        error: (cause: unknown) => {
          this.error.set(errorMessage(cause));
          if (cause instanceof ApiError) {
            applyFieldErrors(this.form, cause.fieldErrors);
          }
        },
      });
  }

  private toggleImei(category: EquipmentCategory): void {
    const phone = category === 'TELEPHONE';
    this.isPhone.set(phone);
    const imei = this.form.controls.imei;
    imei.setValidators(phone ? [Validators.required, imeiValidator] : []);
    if (!phone) {
      imei.setValue('');
    }
    imei.updateValueAndValidity();
  }
}
