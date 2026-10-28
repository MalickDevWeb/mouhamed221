import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { pagedResource } from '../../../shared/data/paged-resource';
import { IfAllowedDirective } from '../../../shared/ui/if-allowed.directive';
import { PaginationComponent } from '../../../shared/ui/pagination.component';
import { StatusBadgeComponent } from '../../../shared/ui/status-badge.component';
import { EquipmentRepository } from '../data/equipment.repository';
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CATEGORY_LABELS,
  EQUIPMENT_CONDITION_LABELS,
  EQUIPMENT_STATUSES,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_STATUS_TONES,
  EquipmentCategory,
  EquipmentQuery,
  EquipmentStatus,
} from '../equipment.models';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-equipment-list-page',
  imports: [RouterLink, StatusBadgeComponent, PaginationComponent, IfAllowedDirective],
  templateUrl: './equipment-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentListPage {
  private readonly repository = inject(EquipmentRepository);

  protected readonly search = signal('');
  protected readonly category = signal<EquipmentCategory | ''>('');
  protected readonly status = signal<EquipmentStatus | ''>('');
  protected readonly pageIndex = signal(0);

  private readonly query = computed<EquipmentQuery>(() => ({
    page: this.pageIndex(),
    size: PAGE_SIZE,
    search: this.search().trim() || undefined,
    category: this.category() || undefined,
    status: this.status() || undefined,
  }));

  protected readonly equipment = pagedResource(this.query, (query) => this.repository.list(query), PAGE_SIZE);

  protected readonly categories = EQUIPMENT_CATEGORIES;
  protected readonly categoryLabels = EQUIPMENT_CATEGORY_LABELS;
  protected readonly statuses = EQUIPMENT_STATUSES;
  protected readonly statusLabels = EQUIPMENT_STATUS_LABELS;
  protected readonly statusTones = EQUIPMENT_STATUS_TONES;
  protected readonly conditionLabels = EQUIPMENT_CONDITION_LABELS;

  protected onSearch(value: string): void {
    this.search.set(value);
    this.pageIndex.set(0);
  }

  protected onCategory(value: string): void {
    this.category.set(value as EquipmentCategory | '');
    this.pageIndex.set(0);
  }

  protected onStatus(value: string): void {
    this.status.set(value as EquipmentStatus | '');
    this.pageIndex.set(0);
  }
}
