import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { FieldError } from '../../core/http/api-error';

/** Numéros sénégalais au format E.164 (ENF-10) : +221 puis 9 chiffres. */
export const SENEGAL_PHONE_PATTERN = /^\+221(70|71|75|76|77|78|33)\d{7}$/;

export function compactPhone(value: string): string {
  return value.replace(/[\s.-]/g, '');
}

export const senegalPhoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = compactPhone(String(control.value ?? ''));
  return !value || SENEGAL_PHONE_PATTERN.test(value) ? null : { phone: true };
};

/** IMEI : 15 chiffres. */
export const imeiValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  return !value || /^\d{15}$/.test(value) ? null : { imei: true };
};

/** Affiche sous chaque champ les erreurs renvoyées par l'API. */
export function applyFieldErrors(form: FormGroup, errors: readonly FieldError[]): void {
  for (const error of errors) {
    const control = form.get(error.field);
    control?.setErrors({ server: error.message });
    control?.markAsTouched();
  }
}
