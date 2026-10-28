import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ROLE_LABELS } from '../auth/roles';
import { SessionStore } from '../auth/session.store';
import { NAV_ITEMS } from './navigation';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);

  protected readonly user = this.session.user;
  protected readonly roleLabel = computed(() => {
    const role = this.session.role();
    return role ? ROLE_LABELS[role] : '';
  });
  protected readonly navItems = computed(() => NAV_ITEMS.filter((item) => this.session.can(item.permission)));
  protected readonly menuOpen = signal(false);

  protected logout(): void {
    this.auth.logout();
  }
}
