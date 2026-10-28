import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { Permission } from '../../core/auth/permissions';
import { SessionStore } from '../../core/auth/session.store';

/**
 * Affiche un élément seulement si le rôle courant a la permission.
 * Usage : <button *appIfAllowed="'drivers.write'">…</button>
 * Rappel RG-14 : ceci masque l'action, la vérification réelle est faite par l'API.
 */
@Directive({ selector: '[appIfAllowed]' })
export class IfAllowedDirective {
  readonly appIfAllowed = input.required<Permission>();

  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private readonly session = inject(SessionStore);

  constructor() {
    effect(() => {
      this.container.clear();
      if (this.session.can(this.appIfAllowed())) {
        this.container.createEmbeddedView(this.template);
      }
    });
  }
}
