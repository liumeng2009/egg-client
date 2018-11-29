import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../bean/role';
import {ToolService} from '../../../../util/tool.service';
import {UserService} from '../user.service';
import {User} from '../../../../bean/user';
import {ResponseData} from '../../../../bean/responseData';
import {EduConfig} from '../../../../config/config';
import {RoleService} from '../../role/role.service';
import {RememberService} from '../../../../util/remember.service';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';


@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  searchkey = '';
  isLoading = false;
  noResult = EduConfig.noResult;
  users: User[] = [];
  private userDelete: number[] = [];
  roles: Role[] = [];
  roleArray: number[] = [];
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  total = 0;
  pageSize = EduConfig.pageSize;
  pageIndex = 1;
  isLoadingDelete = false;
  showAddBtn = false;
  showEditBtn = false;
  showDelBtn = false;
  roleList = false;
  roleListError = '';
  isLoadingRoleList = false;
  nameFilterStyle = {
    color: '#bfbfbf',
  }
  roleFilterStyle = {
    color: '#bfbfbf',
  }
  scrollHeight = {
    y: '0px',
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toolService: ToolService,
    private roleService: RoleService,
    private rememberService: RememberService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.initHeight();
    }, 0);
    this.auth();
    this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
    this.initRoleList();
  }
  private initHeight() {
    this.scrollHeight.y = (window.document.body.clientHeight - 290) + 'px';
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('user');
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

  private initRoleList() {
    this.isLoadingRoleList = true;
    this.roleService.getRoleList(0, 0, '')
      .subscribe(
        (data: ResponseData) => {
          this.isLoadingRoleList = false;
          this.toolService.apiResult(data, true).then((result: ResponseData) => {
            this.roleList = true;
            this.roles = [...result.data.rows];
            for (const trole of this.roles) {
              trole.checked = true;
            }
          }).catch((error) => {
            if (error) {
              this.roleList = false;
              this.roleListError = error;
            }
          });
        },
        error => {
          this.isLoadingRoleList = false;
        }
      );
  }
  private roleFilterAllChanged(e) {
    for (const trole of this.roles) {
      trole.checked = e;
    }
  }
  private roleFilterAllStatus() {
    for (const trole of this.roles) {
      if (trole.checked === false) {
        return false;
      }
    }
    return true;
  }
  filterByRole() {
    this.roleArray.splice(0, this.roleArray.length);
    for (const trole of this.roles) {
      if (trole.checked === true) {
        this.roleArray.push( trole.id );
      }
    }
    if (this.roleFilterAllStatus()) {
      this.roleFilterStyle.color = '#bfbfbf';
    } else {
      this.roleFilterStyle.color = '#1890ff';
    }
    this.getData(0, 0, this.searchkey, this.roleArray);
  }
  filterRemoveRole() {
    this.roleFilterAllChanged(true)
    this.roleArray.splice(0, this.roleArray.length);
    for (const trole of this.roles) {
      if (trole.checked === true) {
        this.roleArray.push( trole.id );
      }
    }
    this.roleFilterStyle.color = '#bfbfbf';
    this.getData(0, 0, this.searchkey, this.roleArray);
  }

  private getData(page, pagesize, searchkey, roles) {
    this.isLoading = true;
    this.userService.getUserList(page, pagesize, searchkey, roles)
      .subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          this.toolService.apiResult(data, false).then((result: ResponseData) => {
            this.users = [...result.data.rows];
            this.total = result.data.count;
          }).catch((error) => {});
        },
        error => {
          this.isLoading = false;
        }
      );
  }
  refresh() {
    if (this.searchkey.trim() === '') {
      this.nameFilterStyle.color = '#bfbfbf';
    } else {
      this.nameFilterStyle.color = '#1890ff';
    }
    this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
  }
  refreshNoSearchKey() {
    this.searchkey = '';
    this.nameFilterStyle.color = '#bfbfbf';
    this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
  }
  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }
  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
  private delete() {
    for (const user of this.users) {
      if (user.checked) {
        this.userDelete.push(user.id);
      }
    }
    if (this.userDelete.length === 0) {
      this.messageService.error(EduConfig.atLeastOneSelected);
      return;
    }
    this.modalService.confirm({
      nzTitle: '确认',
      nzContent: '确认要删除该用户吗？',
      nzOnOk: () => {
        this.isLoadingDelete = true;
        this.userService.delete(this.userDelete).subscribe(
          (data: ResponseData) => {
            this.isLoadingDelete = false;
            this.toolService.apiResult(data, false).then((result: ResponseData) => {
              this.deleteUserInArray(this.userDelete);
            }).catch(() => {});
          },
          error => {
            this.isLoadingDelete = false;
          }
        );
      },
    });
  }
  private deleteUserInArray(ids: number[]) {
    for (const id of ids) {
      this.users = this.users.filter(d => d.id !== id);
      this.total--;
    }
    if (this.users.length === 0) {
      // 被删完了,往前页跳
      if (this.pageIndex > 1) {
        this.pageIndex--;
        this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
      }
    }
  }
  pageChanged(_pageindex) {
    this.pageIndex = _pageindex;
    this.getData(_pageindex, this.pageSize, this.searchkey, this.roleArray);
  }
  allCheck(e) {
    if (e) {
      for (const user of this.users) {
        user.checked = true;
      }
    } else {
      for (const user of this.users) {
        user.checked = false;
      }
    }

  }

  isAllChecked() {
    for (const user of this.users) {
      if (!user.checked) {
        return false;
      }
    }
    return true;
  }
}
