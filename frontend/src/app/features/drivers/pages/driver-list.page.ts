import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { pagedResource } from '../../../shared/data/paged-resource';
import { IfAllowedDirective } from '../../../shared/ui/if-allowed.directive';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge.component';
import { DriverRepository } from '../data/driver.repository';
import {
  DRIVER_STATUSES,
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_TONES,
  DriverQuery,
  DriverStatus,
  SITES,
  driverFullName,
} from '../driver.models';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-driver-list-page',
  imports: [RouterLink, StatusBadgeComponent, PaginationComponent, IfAllowedDirective],
  templateUrl: './driver-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverListPage {
  private readonly repository = inject(DriverRepository);

  protected readonly search = signal('');
  protected readonly status = signal<DriverStatus | ''>('');
  protected readonly site = signal('');
  protected readonly pageIndex = signal(0);

  private readonly query = computed<DriverQuery>(() => ({
    page: this.pageIndex(),
    size: PAGE_SIZE,
    search: this.search().trim() || undefined,
    status: this.status() || undefined,
    site: this.site() || undefined,
  }));

  protected readonly drivers = pagedResource(this.query, (query) => this.repository.list(query), PAGE_SIZE);

  protected readonly statuses = DRIVER_STATUSES;
  protected readonly statusLabels = DRIVER_STATUS_LABELS;
  protected readonly statusTones = DRIVER_STATUS_TONES;
  protected readonly sites = SITES;
  protected readonly fullName = driverFullName;

  /** Tout changement de filtre ramène à la première page. */
  protected filter(apply: () => void): void {
    apply();
    this.pageIndex.set(0);
  }

  protected onSearch(value: string): void {
    this.filter(() => this.search.set(value));
  }

  protected onStatus(value: string): void {
    this.filter(() => this.status.set(value as DriverStatus | ''));
  }

  protected onSite(value: string): void {
    this.filter(() => this.site.set(value));
  }
}
