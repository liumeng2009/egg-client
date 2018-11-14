import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {RoleService} from '../role.service';
import {Role} from '../../../../bean/role';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponseData} from '../../../../bean/responseData';
import {ToolService} from '../../../../util/tool.service';
import {RememberService} from '../../../main/remember.service';
import {AuthService} from '../../auth.service';
import {Auth, AuthList} from '../../../../bean/auth';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-role-edit-page',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit {
  validateForm: FormGroup;
  role: Role;
  canAdd = false;
  canDel = false;
  isLoading = false;
  isLoadingAuthList = false;
  isSubmitLoading = false;
  auths: AuthList[];
  saveBtn = false;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private rememberService: RememberService,
    private authService: AuthService,
    private message: NzMessageService,
  ) {}


  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [ '', [ Validators.required ] ],
      remark: [ '' ],
    });
    this.auth();
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('role');
      this.initComponentAuth(authArray);
      const authInRoleArray = this.initAuth('authInRole');
      this.initComponentAuthInRole(authInRoleArray);
    }
  }
  private initAuth(functioncode) {
    const resultArray = [];
    const user = this.rememberService.getUser();
    if (user && user.role && user.role.auth_authInRoles) {
      const auths = user.role.auth_authInRoles;
      console.log(auths);
      for (const auth of auths) {
        if (auth.auth_opInFunc
          && auth.auth_opInFunc.auth_function
          && auth.auth_opInFunc.auth_function.code
          && auth.auth_opInFunc.auth_function.code === functioncode
        ) {
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  // 根据auth数组，判断页面一些可操作组件的可用/不可用状态
  private initComponentAuth(authArray) {
    for (const auth of authArray) {
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.saveBtn = true;
      }
    }
  }
  private initComponentAuthInRole(authArray) {
    for (const auth of authArray) {
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'add') {
        this.canAdd = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'delete') {
        this.canDel = true;
      }
    }
  }
  private getData(id: string) {
    this.isLoading = true;
    this.roleService.show(id).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, false).then(
          (result: ResponseData) => {
            this.role = {...result.data};
            this.validateForm.setValue({name: this.role.name, remark: this.role.remark});
            this.getAuthData(id);
          }
        ).catch(() => {});
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  private getAuthData(roleId) {
    this.isLoadingAuthList = true;
    this.authService.getAuthList(roleId).subscribe(
      (data: ResponseData) => {
        this.isLoadingAuthList = false;
        this.toolService.apiResult(data, false).then(
          (result: ResponseData) => {
            this.auths = [...result.data];
          }
        );
      },
      error => {
        this.isLoadingAuthList = false;
      }
    );
  }
  private isAllCheckRow(ops) {
    for (const op of ops) {
      if (!op.checked) {
        return false;
      }
    }
    return true;
  }
  private allCheckRow(e, ops) {
    if (e) {
      for (const op of ops) {
        op.checked = true;
      }
    } else {
      for (const op of ops) {
        op.checked = false;
      }
    }
  }
  authChanged(e, authId, authObj) {
    alert(123);
    this.route.params.subscribe((params: Params) => {
      const roleId = params.id;
      if (e) {
        // 新增
        if (!this.canAdd) {
          this.message.error('没有权限进行新增！');
          return;
        }
        this.authService.create(new Auth(roleId, authId)).subscribe(
          (data: ResponseData) => {
            this.toolService.apiResult(data, false).then(
              (result: ResponseData) => {

              }
            ).catch(() => {authObj = !e; });
          },
          error => {
            authObj = !e;
          }
        );
      } else {
        // 删除
        if (!this.canDel) {
          this.message.error('没有权限进行删除！');
          return;
        }
        this.authService.destroy(new Auth(roleId, authId)).subscribe(
          (data: ResponseData) => {
            this.toolService.apiResult(data, false).then(
              (result: ResponseData) => {

              }
            ).catch(() => {authObj.checked = !e; });
          },
          error => {
            authObj.checked = !e;
          }
        );
      }
    });
  }

  refresh() {
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }
  submitForm() {
    console.log('submit');
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isSubmitLoading = true;
      this.role.name = this.validateForm.get('name').value;
      this.role.remark = this.validateForm.get('remark').value;
      this.roleService.update(this.role).subscribe(
        (data: ResponseData) => {
          this.isSubmitLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).catch(() => {});
        },
        error => {
          this.isSubmitLoading = false;
        }
      );
    }
  }
  returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
