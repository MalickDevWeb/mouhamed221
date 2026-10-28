import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly activeTab = signal<'costs' | 'performance'>('costs');
  protected readonly trendPeriod = signal<'monthly' | 'yearly'>('monthly');

  protected setTab(tab: 'costs' | 'performance'): void {
    this.activeTab.set(tab);
  }

  protected setTrendPeriod(period: 'monthly' | 'yearly'): void {
    this.trendPeriod.set(period);
  }

  protected exportSummary(): void {
    const rows = [
      ['Indicateur', 'Valeur'],
      ['Véhicules actifs', '124'],
      ['Chauffeurs actifs', '87'],
      ['Interventions en cours', '12'],
      ['Coût fictif FCFA', '84196500'],
    ];
    const blob = new Blob(['\ufeff' + rows.map((r) => r.join(';')).join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kai-synthese-demo.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
