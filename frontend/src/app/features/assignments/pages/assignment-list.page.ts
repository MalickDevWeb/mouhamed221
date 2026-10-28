import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { errorMessage } from '../../../core/http/api-error';
import { pagedResource } from '../../../shared/data/paged-resource';
import { IfAllowedDirective } from '../../../shared/ui/if-allowed.directive';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge.component';
import { EQUIPMENT_CONDITIONS, EQUIPMENT_CONDITION_LABELS, EquipmentCondition } from '../../equipment/equipment.models';
import { AssignmentQuery, AssignmentView, isActive } from '../assignment.models';
import { AssignmentRepository } from '../data/assignment.repository';
import { statusAfterReturn } from '../domain/assignment.policy';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-assignment-list-page',
  imports: [RouterLink, DatePipe, ReactiveFormsModule, StatusBadgeComponent, PaginationComponent, IfAllowedDirective],
  templateUrl: './assignment-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentListPage {
  private readonly repository = inject(AssignmentRepository);

  protected readonly search = signal('');
  protected readonly activeOnly = signal(true);
  protected readonly pageIndex = signal(0);

  private readonly query = computed<AssignmentQuery>(() => ({
    page: this.pageIndex(),
    size: PAGE_SIZE,
    search: this.search().trim() || undefined,
    activeOnly: this.activeOnly() || undefined,
  }));

  protected readonly assignments = pagedResource(this.query, (query) => this.repository.list(query), PAGE_SIZE);

  /** Affectation dont le formulaire de restitution est ouvert. */
  protected readonly returning = signal<AssignmentView | null>(null);
  protected readonly returnForm = inject(NonNullableFormBuilder).group({
    conditionIn: ['BON' as EquipmentCondition, Validators.required],
    notes: [''],
  });
  protected readonly saving = signal(false);
  protected readonly returnError = signal<string | null>(null);
  protected readonly feedback = signal<string | null>(null);

  protected readonly conditions = EQUIPMENT_CONDITIONS;
  protected readonly conditionLabels = EQUIPMENT_CONDITION_LABELS;
  protected readonly isActive = isActive;

  protected onSearch(value: string): void {
    this.search.set(value);
    this.pageIndex.set(0);
  }

  protected onActiveOnly(checked: boolean): void {
    this.activeOnly.set(checked);
    this.pageIndex.set(0);
  }

  protected openReturn(assignment: AssignmentView): void {
    this.returnForm.reset({ conditionIn: 'BON', notes: '' });
    this.returnError.set(null);
    this.returning.set(assignment);
  }

  protected cancelReturn(): void {
    this.returning.set(null);
  }

  /** Avertit avant validation si l'équipement partira en réparation (RG-12). */
  protected returnOutcome(): string {
    return statusAfterReturn(this.returnForm.controls.conditionIn.value) === 'EN_REPARATION'
      ? "L'équipement passera en réparation. Pensez à déclarer l'incident."
      : "L'équipement redeviendra disponible.";
  }

  protected confirmReturn(): void {
    const assignment = this.returning();
    if (!assignment) {
      return;
    }
    const value = this.returnForm.getRawValue();
    this.saving.set(true);
    this.returnError.set(null);
    this.repository
      .returnEquipment(assignment.id, { conditionIn: value.conditionIn, notes: value.notes.trim() || null })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.feedback.set(`Restitution de ${assignment.equipmentCode} enregistrée (bon ${assignment.receiptNumber}).`);
          this.returning.set(null);
          this.assignments.reload();
        },
        error: (cause: unknown) => this.returnError.set(errorMessage(cause)),
      });
  }
}
