import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PercentPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';

import { errorMessage } from '../../core/http/api-error';
import { DRIVER_STATUSES, DRIVER_STATUS_LABELS } from '../drivers/driver.models';
import { EQUIPMENT_STATUSES, EQUIPMENT_STATUS_LABELS } from '../equipment/equipment.models';
import { DashboardRepository } from './data/dashboard.repository';
import { DashboardSummary } from './dashboard.models';

type DashboardState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; summary: DashboardSummary };

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, PercentPipe],
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly state = toSignal(
    inject(DashboardRepository)
      .summary()
      .pipe(
        map((summary): DashboardState => ({ kind: 'ready', summary })),
        startWith<DashboardState>({ kind: 'loading' }),
        catchError((cause: unknown) => of<DashboardState>({ kind: 'error', message: errorMessage(cause) })),
      ),
    { initialValue: { kind: 'loading' } as DashboardState },
  );

  protected readonly summary = computed(() => {
    const state = this.state();
    return state.kind === 'ready' ? state.summary : null;
  });

  protected readonly driverStatuses = DRIVER_STATUSES;
  protected readonly driverLabels = DRIVER_STATUS_LABELS;
  protected readonly equipmentStatuses = EQUIPMENT_STATUSES;
  protected readonly equipmentLabels = EQUIPMENT_STATUS_LABELS;
}
