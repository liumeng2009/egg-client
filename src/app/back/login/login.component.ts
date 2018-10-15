import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
import * as moment from 'moment';
import {LoginService} from './login.service';
import {User} from '../../bean/user';
import {ResponseData} from '../../bean/responseData';
import {ToolService} from '../../util/tool.service';
import {Router, ActivatedRoute} from '@angular/router';
import {RememberService} from '../main/remember.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private toolService: ToolService,
    private cookieService: CookieService,
    private title: Title,
    private router: Router,
    private route: ActivatedRoute,
    private rememberService: RememberService,
  ) {
    this.title.setTitle('登录');
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [ '15822927208', [ Validators.required ] ],
      password: [ 'admin', [ Validators.required ] ],
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
      const password = this.validateForm.get('password').value;
      const user: User = new User(null, null, password, null,
        null, null, null, mobile);
      this.loginService.login(user).subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
            const expires = moment().add(30, 'day').toDate();
            this.cookieService.put('eduToken', result.data.user.token, {expires: expires});
            const userResult: User = {...result.data.user};
            this.rememberService.setUser(userResult);
            this.router.navigate(['admin'], );
          }
        },
        error => {

        }
      );
    }
  }


}
