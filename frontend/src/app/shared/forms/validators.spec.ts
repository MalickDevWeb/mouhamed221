import { FormControl } from '@angular/forms';

import { imeiValidator, senegalPhoneValidator } from './validators';

describe('senegalPhoneValidator (ENF-10)', () => {
  it.each(['+221771234567', '+221 77 123 45 67', '+221338001122'])('accepte %s', (value) => {
    expect(senegalPhoneValidator(new FormControl(value))).toBeNull();
  });

  it.each(['771234567', '+22177123456', '+221991234567'])('refuse %s', (value) => {
    expect(senegalPhoneValidator(new FormControl(value))).toEqual({ phone: true });
  });
});

describe('imeiValidator', () => {
  it('accepte 15 chiffres', () => {
    expect(imeiValidator(new FormControl('356938035643809'))).toBeNull();
  });

  it('refuse un IMEI trop court', () => {
    expect(imeiValidator(new FormControl('35693803564'))).toEqual({ imei: true });
  });
});
