import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../bean/role';
import {RoleService} from '../role.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {EduConfig} from '../../../../config/config';
import {NzModalService} from 'ng-zorro-antd';
import {RememberService} from '../../../main/remember.service';

@Component({
  selector: 'app-role-list-page',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {

  searchkey = '';
  isLoading = false;
  roles: Role[] = [];
  roleDelete: number[] = [];
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  total = 0;
  pageSize = new EduConfig().pageSize;
  pageIndex = 1;
  showAddBtn = false;
  showEditBtn = false;
  showDelBtn = false;
  showModalBtn = false;
  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private modalService: NzModalService,
    private rememberService: RememberService,
  ) {}

  ngOnInit() {
    this.auth();
    this.initHeight();
    this.getData(this.pageIndex, this.pageSize, undefined);
  }

  private initHeight() {
    // this.tableHeight.y = false;
    // (window.document.body.clientHeight - (32 + 64 + 69 + 21 + 16 + 49 + 32 + 25 + 7 + 17)) + 'px';
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
        this.showAddBtn = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.showEditBtn = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'delete') {
        this.showDelBtn = true;
      }
    }
  }


  private getData(page, pagesize, searchkey) {
    this.isLoading = true;
    this.roleService.getRoleList(page, pagesize, searchkey)
      .subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.roles = [...result.data.rows];
              for (const r of this.roles) {
                r.checked = false;
              }
              this.total = result.data.count;
            }
          ).catch(() => {});
        },
        error => {
          this.isLoading = false;
        }
      );
  }
  refresh() {
    this.getData(this.pageIndex, this.pageSize, this.searchkey);
  }
  refreshNoSearchKey() {
    this.searchkey = '';
    this.getData(this.pageIndex, this.pageSize, this.searchkey);
  }
  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }

  private delete() {
    for (const role of this.roles) {
      if (role.checked) {
        this.roleDelete.push(role.id);
      }
    }
    this.roleService.delete(this.roleDelete).subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, false).then(
          (result: ResponseData) => {
            this.deleteRoleInArray(this.roleDelete);
          }
        ).catch(() => {});
      },
      error => {

      }
    );
  }

  private deleteRoleInArray(ids: number[]) {
    console.log(ids);

    for (const id of ids) {
      let index = 0;
      for (const per of this.roles) {
        if (per.id === id) {
          this.roles.splice(index, 1);
          this.total--;
          break;
        }
        index++;
      }
    }
    if (this.roles.length === 0) {
      // 被删完了,往前页跳
      if (this.pageIndex > 1) {
        this.pageIndex--;
        this.getData(this.pageIndex, this.pageSize, this.searchkey);
      }
    }
  }

  pageChanged(_pageindex) {
    this.pageIndex = _pageindex;
    this.getData(_pageindex, this.pageSize, this.searchkey);
  }

  allCheck(e) {
    if (e) {
      for (const role of this.roles) {
        role.checked = true;
      }
    } else {
      for (const role of this.roles) {
        role.checked = false;
      }
    }

  }

  isAllChecked() {
    for (const role of this.roles) {
      if (!role.checked) {
        return false;
      }
    }
    return true;
  }
}
