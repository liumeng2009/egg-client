import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService, NzModalRef} from 'ng-zorro-antd';
import {AuthService} from '../../auth.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {AuthList, Auth} from '../../../../bean/auth';
import {RememberService} from '../../../main/remember.service';

@Component({
  selector: 'app-role-auth-page',
  templateUrl: './role-auth.component.html',
  styleUrls: ['./role-auth.component.scss']
})

export class RoleAuthComponent implements OnInit {
  @Input() roleId: number;
  isLoading = true;
  auths: AuthList[];
  canAdd = false;
  canDel = false;
  constructor(
    private modal: NzModalRef,
    private authService: AuthService,
    private toolService: ToolService,
    private rememberService: RememberService,
    private message: NzMessageService,
  ) { }
  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }

  ngOnInit(): void {
    this.auth();
    this.getData(this.roleId);
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('authInRole');
      console.log(authArray);
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
  private getData(roleId) {
    this.isLoading = true;
    this.authService.getAuthList(roleId).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, false).then(
          (result: ResponseData) => {
            this.auths = [...result.data];
          }
        );
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  refresh() {
    this.getData(this.roleId);
  }
  authChanged(e, authId, authObj) {
    if (e) {
      // 新增
      if (!this.canAdd) {
        this.message.error('没有权限进行新增！');
        return;
      }
      this.authService.create(new Auth(this.roleId, authId)).subscribe(
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
      this.authService.destroy(new Auth(this.roleId, authId)).subscribe(
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
  }
}
