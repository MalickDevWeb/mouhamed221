import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

const MESSAGES: Record<string, (error: ValidationErrors[string]) => string> = {
  required: () => 'Champ obligatoire.',
  email: () => 'Adresse e-mail invalide.',
  phone: () => 'Format attendu : +221 suivi de 9 chiffres (ex. +221771234567).',
  imei: () => "L'IMEI doit contenir exactement 15 chiffres.",
  maxlength: (error) => `${error.requiredLength} caractères maximum.`,
  server: (error) => String(error),
};

/** Message de validation en français clair, placé sous le champ (section 6.3). */
@Component({
  selector: 'app-field-error',
  template: `
    @if (message(); as text) {
      <small class="field-error">{{ text }}</small>
    }
  `,
})
export class FieldErrorComponent {
  readonly control = input.required<AbstractControl>();

  protected message(): string | null {
    const control = this.control();
    if (!control.errors || !control.touched) {
      return null;
    }
    const [key, value] = Object.entries(control.errors)[0];
    return MESSAGES[key]?.(value) ?? 'Valeur invalide.';
  }
}
