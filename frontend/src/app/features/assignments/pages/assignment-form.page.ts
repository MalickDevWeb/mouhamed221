import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { errorMessage } from '../../../core/http/api-error';
import { FieldErrorComponent } from '../../../shared/forms/field-error.component';
import { DriverRepository } from '../../drivers/data/driver.repository';
import { Driver, driverFullName } from '../../drivers/driver.models';
import { EquipmentRepository } from '../../equipment/data/equipment.repository';
import {
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_CONDITION_LABELS,
  Equipment,
  EquipmentCondition,
  equipmentLabel,
} from '../../equipment/equipment.models';
import { AssignmentView } from '../assignment.models';
import { AssignmentRepository } from '../data/assignment.repository';
import { VIOLATION_MESSAGES, checkAssignment } from '../domain/assignment.policy';

/** Nombre maximal d'éléments chargés dans les listes de choix. */
const OPTIONS_LIMIT = 500;

@Component({
  selector: 'app-assignment-form-page',
  imports: [ReactiveFormsModule, RouterLink, FieldErrorComponent],
  templateUrl: './assignment-form.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentFormPage implements OnInit {
  /** Pré-sélection depuis la fiche chauffeur (?driverId=…). */
  readonly driverId = input<string>();

  private readonly drivers = inject(DriverRepository);
  private readonly equipment = inject(EquipmentRepository);
  private readonly assignments = inject(AssignmentRepository);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group({
    driverId: ['', Validators.required],
    equipmentId: ['', Validators.required],
    conditionOut: ['BON' as EquipmentCondition, Validators.required],
    notes: ['', Validators.maxLength(500)],
  });

  protected readonly driverOptions = signal<Driver[]>([]);
  protected readonly equipmentOptions = signal<Equipment[]>([]);
  private readonly activeAssignments = signal<AssignmentView[]>([]);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  private readonly selection = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  /** Règles évaluées dès la sélection ; l'API les revérifie (RG-14). */
  protected readonly violations = computed(() => {
    const { driverId, equipmentId } = this.selection();
    const driver = this.driverOptions().find((item) => item.id === driverId);
    const equipment = this.equipmentOptions().find((item) => item.id === equipmentId);
    if (!driver || !equipment) {
      return [];
    }
    const active = this.activeAssignments();
    return checkAssignment({
      equipment,
      driver,
      equipmentHasActiveAssignment: active.some((a) => a.equipmentId === equipment.id),
      driverActivePhones: active.filter((a) => a.driverId === driver.id && a.equipmentCategory === 'TELEPHONE').length,
    }).map((violation) => VIOLATION_MESSAGES[violation]);
  });

  protected readonly conditions = EQUIPMENT_CONDITIONS;
  protected readonly conditionLabels = EQUIPMENT_CONDITION_LABELS;
  protected readonly categoryLabels = EQUIPMENT_CATEGORY_LABELS;
  protected readonly fullName = driverFullName;
  protected readonly label = equipmentLabel;

  ngOnInit(): void {
    forkJoin({
      drivers: this.drivers.list({ page: 0, size: OPTIONS_LIMIT, status: 'ACTIF' }),
      equipment: this.equipment.list({ page: 0, size: OPTIONS_LIMIT, status: 'DISPONIBLE' }),
      active: this.assignments.list({ page: 0, size: OPTIONS_LIMIT * 2, activeOnly: true }),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ drivers, equipment, active }) => {
          this.driverOptions.set(drivers.content);
          this.equipmentOptions.set(equipment.content);
          this.activeAssignments.set(active.content);
          const preselected = this.driverId();
          if (preselected && drivers.content.some((driver) => driver.id === preselected)) {
            this.form.controls.driverId.setValue(preselected);
          }
        },
        error: (cause: unknown) => this.error.set(errorMessage(cause)),
      });
  }

  protected submit(): void {
    if (this.form.invalid || this.violations().length > 0) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);
    this.assignments
      .create({ ...value, notes: value.notes.trim() || null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/affectations']),
        error: (cause: unknown) => this.error.set(errorMessage(cause)),
      });
  }
}
