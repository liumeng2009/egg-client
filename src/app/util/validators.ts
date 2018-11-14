import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export class ConstomValidators {
  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const phoneReg = /^[1][3,4,5,7,8，9][0-9]{9}$/;
      const forbidden = phoneReg.test(control.value);
      return !forbidden ? {'errorPhone': {value: control.value}} : null;
    };
  }
  static identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const new_password = control.get('new_password');
    const new_password_compare = control.get('new_password_compare');
    const result = (new_password && new_password_compare && new_password.value === new_password_compare.value)
      ?  null : { 'identityRevealed': true };
    return result;
  }
}
