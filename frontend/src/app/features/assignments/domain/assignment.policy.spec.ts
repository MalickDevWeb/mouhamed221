import { AssignmentContext, checkAssignment, statusAfterReturn } from './assignment.policy';

function context(overrides: Partial<AssignmentContext> = {}): AssignmentContext {
  return {
    equipment: { status: 'DISPONIBLE', category: 'TELEPHONE' },
    equipmentHasActiveAssignment: false,
    driver: { status: 'ACTIF' },
    driverActivePhones: 0,
    ...overrides,
  };
}

describe('checkAssignment', () => {
  it('autorise un équipement disponible pour un chauffeur actif', () => {
    expect(checkAssignment(context())).toEqual([]);
  });

  it('refuse une double affectation active (RG-02)', () => {
    expect(checkAssignment(context({ equipmentHasActiveAssignment: true }))).toEqual(['EQUIPMENT_ALREADY_ASSIGNED']);
  });

  it('refuse un équipement en réparation (RG-03)', () => {
    const result = checkAssignment(context({ equipment: { status: 'EN_REPARATION', category: 'TABLETTE' } }));
    expect(result).toEqual(['EQUIPMENT_NOT_AVAILABLE']);
  });

  it('refuse un chauffeur suspendu (RG-03)', () => {
    expect(checkAssignment(context({ driver: { status: 'SUSPENDU' } }))).toEqual(['DRIVER_NOT_ACTIVE']);
  });

  it('refuse un second téléphone au même chauffeur (RG-05)', () => {
    expect(checkAssignment(context({ driverActivePhones: 1 }))).toEqual(['DRIVER_ALREADY_HAS_PHONE']);
  });

  it("n'applique pas RG-05 aux autres catégories", () => {
    const result = checkAssignment(context({ equipment: { status: 'DISPONIBLE', category: 'ACCESSOIRE' }, driverActivePhones: 1 }));
    expect(result).toEqual([]);
  });
});

describe('statusAfterReturn (RG-12)', () => {
  it('remet en disponible un équipement rendu en bon état', () => {
    expect(statusAfterReturn('BON')).toBe('DISPONIBLE');
  });

  it('envoie en réparation un équipement rendu endommagé', () => {
    expect(statusAfterReturn('ENDOMMAGE')).toBe('EN_REPARATION');
  });
});
