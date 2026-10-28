import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Écran temporaire des modules prévus dans un sprint ultérieur (section 14.3). */
@Component({
  selector: 'app-coming-soon-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <header class="page-header">
        <h1>{{ title() }}</h1>
      </header>
      <div class="card empty-state">
        <p>Ce module sera développé au {{ sprint() }}.</p>
        <p class="muted">Exigences couvertes : {{ requirements() }}</p>
      </div>
    </section>
  `,
})
export class ComingSoonPage {
  /** Valeurs fournies par la propriété data de la route. */
  readonly title = input('Module');
  readonly sprint = input('sprint suivant');
  readonly requirements = input('');
}
