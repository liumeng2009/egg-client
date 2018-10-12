import {Component, OnInit} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {LoginService} from './login.service';
import {User} from '../bean/user';
import {ResponseData} from '../bean/responseData';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService
  ) {

  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const mobile = this.validateForm.get('userName').value;
      const password = this.validateForm.get('userName').value;
      const user: User = new User(null, null, password, null,
        null, null, null, mobile);
      this.loginService.login(user).subscribe(
        (data: ResponseData) => {
          console.log(data);
        },
        error => {

        }
      );
    }
  }


}
