import { Assignment } from '../features/assignments/assignment.models';
import { DRIVER_STATUSES, Driver, SITES } from '../features/drivers/driver.models';
import { Equipment, EquipmentCategory } from '../features/equipment/equipment.models';

/** Données entièrement fictives (RGL-08), générées de façon déterministe. */
const FIRST_NAMES = [
  'Moussa', 'Awa', 'Ibrahima', 'Fatou', 'Cheikh', 'Aminata', 'Ousmane', 'Mariama', 'Abdoulaye', 'Khady',
  'Mamadou', 'Ndeye', 'Babacar', 'Seynabou', 'Alioune', 'Coumba', 'Modou', 'Astou', 'Lamine', 'Rokhaya',
  'Pape', 'Dieynaba', 'Serigne', 'Bineta', 'Assane',
];
const LAST_NAMES = ['Diop', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Gueye', 'Sarr', 'Faye', 'Diallo', 'Cissé', 'Mbaye', 'Thiam', 'Kane', 'Seck', 'Niang'];
const PHONE_MODELS = [
  { brand: 'Samsung', model: 'Galaxy A15' },
  { brand: 'Tecno', model: 'Spark 20' },
  { brand: 'Xiaomi', model: 'Redmi 13C' },
];

const pad = (value: number, length: number) => String(value).padStart(length, '0');

function driverStatus(index: number): Driver['status'] {
  if (index % 11 === 10) return DRIVER_STATUSES[2];
  if (index % 7 === 3) return DRIVER_STATUSES[1];
  return DRIVER_STATUSES[0];
}

export function seedDrivers(): Driver[] {
  return FIRST_NAMES.map((firstName, index) => ({
    id: `drv-${pad(index + 1, 3)}`,
    matricule: `CH-${pad(index + 1, 4)}`,
    firstName,
    lastName: LAST_NAMES[index % LAST_NAMES.length],
    birthDate: `19${80 + (index % 18)}-${pad((index % 12) + 1, 2)}-${pad((index % 27) + 1, 2)}`,
    phone: `+22177${pad(1000000 + index * 37123, 7).slice(-7)}`,
    email: index % 3 === 0 ? `${firstName.toLowerCase()}.${index}@exemple.sn` : null,
    address: `${10 + index} rue ${index % 2 === 0 ? 'Carnot' : 'Blaise Diagne'}`,
    site: SITES[index % SITES.length],
    hireDate: `202${3 + (index % 3)}-${pad((index % 12) + 1, 2)}-15`,
    status: driverStatus(index),
    licenseNumber: `SN-PC-${100000 + index * 713}`,
    idCardNumber: `1${pad(750000000000 + index * 9876543, 12)}`,
  }));
}

function category(index: number): EquipmentCategory {
  if (index % 5 === 3) return 'TABLETTE';
  if (index % 10 === 9) return 'ORDINATEUR';
  if (index % 5 === 4) return 'ACCESSOIRE';
  return 'TELEPHONE';
}

export function seedEquipment(): Equipment[] {
  return Array.from({ length: 40 }, (_, index) => {
    const kind = category(index);
    const phone = PHONE_MODELS[index % PHONE_MODELS.length];
    const isPhone = kind === 'TELEPHONE';
    return {
      id: `eqp-${pad(index + 1, 3)}`,
      code: `EQ-${pad(index + 1, 4)}`,
      category: kind,
      brand: isPhone ? phone.brand : kind === 'TABLETTE' ? 'Lenovo' : kind === 'ORDINATEUR' ? 'HP' : 'Anker',
      model: isPhone ? phone.model : kind === 'TABLETTE' ? 'Tab M10' : kind === 'ORDINATEUR' ? 'ProBook 450' : 'Chargeur 20W',
      serialNumber: `SN${482910 + index * 7919}`,
      imei: isPhone ? `35${pad(1000000000000 + index * 7654321, 13)}` : null,
      acquisitionDate: `2025-${pad((index % 12) + 1, 2)}-01`,
      warrantyEndDate: `2027-${pad((index % 12) + 1, 2)}-01`,
      condition: index % 6 === 0 ? 'NEUF' : 'BON',
      status: index % 13 === 5 ? 'EN_REPARATION' : index === 38 ? 'RETIRE' : 'DISPONIBLE',
    };
  });
}

/** Affecte un téléphone disponible aux premiers chauffeurs actifs. */
export function seedAssignments(drivers: Driver[], equipment: Equipment[]): Assignment[] {
  const activeDrivers = drivers.filter((driver) => driver.status === 'ACTIF').slice(0, 12);
  const phones = equipment.filter((item) => item.category === 'TELEPHONE' && item.status === 'DISPONIBLE');

  return activeDrivers.flatMap((driver, index) => {
    const phone = phones[index];
    if (!phone) return [];
    phone.status = 'ATTRIBUE';
    return [
      {
        id: `aff-${pad(index + 1, 3)}`,
        receiptNumber: `BR-2026-${pad(index + 1, 5)}`,
        equipmentId: phone.id,
        driverId: driver.id,
        assignedAt: `2026-0${(index % 9) + 1}-10`,
        assignedBy: 'Technicien démo',
        conditionOut: phone.condition,
        returnedAt: null,
        conditionIn: null,
        notes: null,
      },
    ];
  });
}
