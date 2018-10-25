import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../bean/role';
import {RoleService} from '../role.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {EduConfig} from '../../../../config/config';
import {RoleAuthComponent} from './role-auth.component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-role-list-page',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {

  private searchkey = '';
  private isLoading = false;
  private roles: Role[] = [];
  private roleDelete: Role;
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  private tableHeight = {
    y : '0px'
  }
  private total = 0;
  private pageSize = new EduConfig().pageSize;
  private pageIndex = 1;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    this.getData(this.pageIndex, this.pageSize, undefined);
    this.initHeight();
  }

  private initHeight() {
    this.tableHeight.y = (window.document.body.clientHeight - (32 + 64 + 69 + 21 + 16 + 49 + 32 + 25 + 7 + 17)) + 'px';
  }

  private getData(page, pagesize, searchkey) {
    this.isLoading = true;
    this.roleService.getRoleList(page, pagesize, searchkey)
      .subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          const result = this.toolService.apiResult(data);
          if (result) {
            this.roles = [...result.data.rows];
            this.total = result.data.count;
          }
        },
        error => {
          this.isLoading = false;
        }
      );
  }
  private refresh() {
    this.getData(this.pageIndex, this.pageSize, this.searchkey);
  }
  private refreshNoSearchKey() {
    this.searchkey = '';
    this.getData(this.pageIndex, this.pageSize, this.searchkey);
  }
  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }

  private delete(id) {
    this.roleService.delete(id).subscribe(
      (data: ResponseData) => {
        const result = this.toolService.apiResult(data);
        if (result) {
          this.roleDelete = {...result.data};
          console.log(this.roleDelete);
          this.deleteRoleInArray(this.roleDelete);
        }
      },
      error => {

      }
    );
  }

  private deleteRoleInArray(role: Role) {
    let index = 0;
    for (const per of this.roles) {
      if (per.id === role.id) {
        this.roles.splice(index, 1);
        this.total--;
        break;
      }
      index++;
    }
    if (this.roles.length === 0) {
      // 被删完了,往前页跳
      if (this.pageIndex > 1) {
        this.pageIndex--;
        this.getData(this.pageIndex, this.pageSize, this.searchkey);
      }
    }
  }

  private pageChanged(_pageindex) {
    this.pageIndex = _pageindex;
    this.getData(_pageindex, this.pageSize, this.searchkey);
  }

  private editAuth(id, name) {
    const modal = this.modalService.create({
      nzTitle: '编辑' + name + '的权限',
      nzContent: RoleAuthComponent,
      nzComponentParams: {
        roleId: id,
      },
      nzFooter: [{
        label: '刷新',
        loading: (componentInstance) => {
          return componentInstance.isLoading;
        },
        onClick: (componentInstance) => {
          componentInstance.refresh();
        }
      }],
      nzWidth: 820,
    });
  }
}
