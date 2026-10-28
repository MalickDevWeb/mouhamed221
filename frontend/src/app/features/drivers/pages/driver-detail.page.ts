import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { errorMessage } from '../../../core/http/api-error';
import { IfAllowedDirective } from '../../../shared/ui/if-allowed.directive';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge.component';
import { AssignmentView, isActive } from '../../assignments/assignment.models';
import { AssignmentRepository } from '../../assignments/data/assignment.repository';
import { EQUIPMENT_CONDITION_LABELS } from '../../equipment/equipment.models';
import { DriverRepository } from '../data/driver.repository';
import { DRIVER_STATUS_LABELS, DRIVER_STATUS_TONES, Driver, driverFullName } from '../driver.models';

/** Fiche 360° du chauffeur (EF-13) : identité, équipements détenus, historique. */
@Component({
  selector: 'app-driver-detail-page',
  imports: [RouterLink, DatePipe, StatusBadgeComponent, IfAllowedDirective],
  templateUrl: './driver-detail.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverDetailPage implements OnInit {
  readonly id = input.required<string>();

  private readonly drivers = inject(DriverRepository);
  private readonly assignmentRepository = inject(AssignmentRepository);

  protected readonly driver = signal<Driver | null>(null);
  protected readonly assignments = signal<AssignmentView[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly activeAssignments = computed(() => this.assignments().filter(isActive));

  protected readonly statusLabels = DRIVER_STATUS_LABELS;
  protected readonly statusTones = DRIVER_STATUS_TONES;
  protected readonly conditionLabels = EQUIPMENT_CONDITION_LABELS;
  protected readonly fullName = driverFullName;
  protected readonly isActive = isActive;

  ngOnInit(): void {
    forkJoin({
      driver: this.drivers.get(this.id()),
      assignments: this.assignmentRepository.list({ page: 0, size: 100, driverId: this.id() }),
    }).subscribe({
      next: ({ driver, assignments }) => {
        this.driver.set(driver);
        this.assignments.set(assignments.content);
      },
      error: (cause: unknown) => this.error.set(errorMessage(cause)),
    });
  }
}
