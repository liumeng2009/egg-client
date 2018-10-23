import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../bean/role';
import {ToolService} from '../../../../util/tool.service';
import {UserService} from '../user.service';
import {User} from '../../../../bean/user';
import {ResponseData} from '../../../../bean/responseData';
import {EduConfig} from '../../../../config/config';
import {RoleService} from '../../role/role.service';


@Component({
  selector: 'app-user-list-page',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  private searchkey = '';
  private isLoading = false;
  private users: User[] = [];
  private roles: Role[] = [];
  private roleArray: number[] = [];
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  private tableHeight = {
    y : '0px'
  }
  private total = 0;
  private pageSize = new EduConfig().pageSize;
  private pageIndex = 1;
  private userDelete: User;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toolService: ToolService,
    private roleService: RoleService,
  ) {}

  ngOnInit() {
    this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
    this.initRoleList();
    this.initHeight();
  }
  private initHeight() {
    this.tableHeight.y = (window.document.body.clientHeight - (32 + 64 + 69 + 21 + 16 + 49 + 32 + 25 + 7 + 17)) + 'px';
  }
  private initRoleList() {
    this.roleService.getRoleList(0, 0, '')
      .subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
            this.roles = [...result.data.rows];
            for (const trole of this.roles) {
              trole.checked = true;
            }
          }
        },
        error => {

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
  private filterByRole() {
    this.roleArray.splice(0, this.roleArray.length);
    for (const trole of this.roles) {
      if (trole.checked === true) {
        this.roleArray.push( parseInt(trole.id, 10) );
      }
    }
    console.log(this.roleArray);
    this.getData(0, 0, this.searchkey, this.roleArray);
  }

  private getData(page, pagesize, searchkey, roles) {
    this.isLoading = true;
    this.userService.getUserList(page, pagesize, searchkey, roles)
      .subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          const result = this.toolService.apiResult(data);
          if (result) {
            this.users = [...result.data.rows];
            this.total = result.data.count;
          }
        },
        error => {
          this.isLoading = false;
        }
      );
  }
  private refresh() {
    console.log(this.searchkey);
    console.log(this.roleArray);
    this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
  }
  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }
  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
  private delete(id) {
    this.userService.delete(id).subscribe(
      (data: ResponseData) => {
        const result = this.toolService.apiResult(data);
        if (result) {
          this.userDelete = {...result.data};
          console.log(this.userDelete);
          this.deleteRoleInArray(this.userDelete);
        }
      },
      error => {

      }
    );
  }
  private deleteRoleInArray(user: User) {
    let index = 0;
    for (const per of this.users) {
      if (per.id === user.id) {
        this.users.splice(index, 1);
        this.total--;
        break;
      }
      index++;
    }
    if (this.users.length === 0) {
      // 被删完了,往前页跳
      if (this.pageIndex > 1) {
        this.pageIndex--;
        this.getData(this.pageIndex, this.pageSize, this.searchkey, this.roleArray);
      }
    }
  }
  private pageChanged(_pageindex) {
    this.pageIndex = _pageindex;
    this.getData(_pageindex, this.pageSize, this.searchkey, this.roleArray);
  }
}
