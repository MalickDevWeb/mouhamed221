import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page">
      <div class="card empty-state">
        <h1>Accès refusé</h1>
        <p>Votre rôle ne permet pas d'accéder à cette page.</p>
        <a class="btn btn-primary" routerLink="/dashboard">Retour au tableau de bord</a>
      </div>
    </section>
  `,
})
export class ForbiddenPage {}
