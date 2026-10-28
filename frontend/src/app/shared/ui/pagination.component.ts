import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="pagination" aria-label="Pagination">
        <button type="button" class="btn btn-sm" [disabled]="page() === 0" (click)="pageChange.emit(page() - 1)">
          Précédent
        </button>
        <span>Page {{ page() + 1 }} sur {{ totalPages() }}</span>
        <button
          type="button"
          class="btn btn-sm"
          [disabled]="page() + 1 >= totalPages()"
          (click)="pageChange.emit(page() + 1)"
        >
          Suivant
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  /** Index de page commençant à 0. */
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();
}
