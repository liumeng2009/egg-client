import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConstomValidators} from '../../../util/validators';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../user/user.service';
import {ToolService} from '../../../util/tool.service';
import {NzMessageService, NzModalRef, NzModalService} from 'ng-zorro-antd';
import {ResponseData} from '../../../bean/responseData';
import {EduConfig} from '../../../config/config';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-password-page',
  templateUrl: './password.component.html'
})

export class PasswordComponent implements OnInit {
  validateForm: FormGroup;
  isSubmitLoading = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toolService: ToolService,
    private cookieService: CookieService,
    private modal: NzModalRef,
  ) {}
  ngOnInit() {
    this.validateForm = new FormGroup({
      old_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      new_password_compare: new FormControl('', Validators.required),
    },  { validators: ConstomValidators.identityRevealedValidator });
  }
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isSubmitLoading = true;
      const old_password = this.validateForm.get('old_password').value;
      const new_password = this.validateForm.get('new_password').value;
      const new_password_compare = this.validateForm.get('new_password_compare').value;
      this.userService.changePassword({
        old_password: old_password,
        new_password: new_password,
        new_password_compare: new_password_compare,
      }).subscribe(
        (data: ResponseData) => {
          this.isSubmitLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.cookieService.remove('eduToken');
              this.modal.destroy();
              setTimeout(() => {
                this.router.navigateByUrl('admin/login');
              }, 500);
            }
          ).catch(() => {});
        },
        error => {
          this.isSubmitLoading = false;
        }
      );
    }
  }
}
