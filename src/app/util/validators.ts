import {AbstractControl, ValidatorFn} from '@angular/forms';

export class ConstomValidators {
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const phoneReg = /^[1][3,4,5,7,8，9][0-9]{9}$/;
      const forbidden = phoneReg.test(control.value);
      return !forbidden ? {'errorPhone': {value: control.value}} : null;
    };
  }
}
