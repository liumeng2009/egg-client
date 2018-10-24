import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {AuthService} from '../../auth.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {AuthList, Auth} from '../../../../bean/auth';

@Component({
  selector: 'app-role-auth-page',
  templateUrl: './role-auth.component.html',
  styleUrls: ['./role-auth.component.scss']
})

export class RoleAuthComponent implements OnInit {
  @Input() roleId: number;
  isLoading = false;
  auths: AuthList[];
  constructor(
    private modal: NzModalRef,
    private authService: AuthService,
    private toolService: ToolService,
  ) { }
  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }

  ngOnInit(): void {
    this.getData(this.roleId);
  }
  private getData(roleId) {
    this.isLoading = true;
    this.authService.getAuthList(roleId).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        const result = this.toolService.apiResult(data);
        if (result) {
          this.auths = [...result.data];
        }
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
      this.authService.create(new Auth(this.roleId, authId)).subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
          } else {
            authObj = !e;
          }
        },
        error => {
          authObj = !e;
        }
      );
    } else {
      // 删除
      this.authService.destroy(new Auth(this.roleId, authId)).subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
          } else {
            authObj = !e;
          }
        },
        error => {
          authObj = !e;
        }
      );
    }
  }
}
