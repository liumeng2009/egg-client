import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {RoleService} from '../role.service';
import {Role} from '../../../../bean/role';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponseData} from '../../../../bean/responseData';
import {ToolService} from '../../../../util/tool.service';
import {RememberService} from '../../../main/remember.service';
import {MissionService} from '../../../main/mission.service';

@Component({
  selector: 'app-role-add-page',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})

export class RoleAddComponent implements OnInit {
  validateForm: FormGroup;
  role: Role;
  isLoading = false;
  saveBtn = false;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private rememberService: RememberService,
  ) {}


  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [ '', [ Validators.required ] ],
      remark: [ '' ],
    });
    this.auth();
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('role');
      this.initComponentAuth(authArray);
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
        && auth.auth_opInFunc.auth_operate.code === 'add') {
        this.saveBtn = true;
      }
    }
  }


  private submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      const name = this.validateForm.get('name').value;
      const remark = this.validateForm.get('remark').value;
      this.role = new Role(null, name, remark, null);
      this.roleService.create(this.role).subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).catch(() => {});
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
  private returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
