import { isAllowed } from './permissions';

describe('isAllowed (matrice des droits, section 5.2)', () => {
  it('refuse tout accès sans rôle', () => {
    expect(isAllowed(null, 'dashboard.read')).toBe(false);
  });

  it('réserve la gestion des comptes à l’administrateur', () => {
    expect(isAllowed('ADMIN', 'users.manage')).toBe(true);
    expect(isAllowed('RH', 'users.manage')).toBe(false);
  });

  it('autorise le RH à gérer les chauffeurs mais pas le parc', () => {
    expect(isAllowed('RH', 'drivers.write')).toBe(true);
    expect(isAllowed('RH', 'equipment.write')).toBe(false);
  });

  it('autorise le technicien à affecter mais pas à modifier un chauffeur', () => {
    expect(isAllowed('TECHNICIEN', 'assignments.write')).toBe(true);
    expect(isAllowed('TECHNICIEN', 'drivers.write')).toBe(false);
  });

  it('limite l’auditeur à la lecture et au journal d’audit', () => {
    expect(isAllowed('AUDITEUR', 'audit.read')).toBe(true);
    expect(isAllowed('AUDITEUR', 'assignments.write')).toBe(false);
  });
});
