import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../bean/role';
import {RoleService} from '../role.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {EduConfig} from '../../../../config/config';

@Component({
  selector: 'app-role-list-page',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {

  private searchkey = '';
  private isLoading = false;
  private roles: Role[];
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  private tableHeight = {
    y : '0px'
  }
  private total = 0;
  //private pageSize = new EduConfig().pageSize;
  private pageSize = 2;
  private pageIndex = 1;
  private pagechanged: EventEmitter<number>;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
  ) {}

  ngOnInit() {
    this.getData(undefined, this.pageSize, undefined);
    this.initHeight();
    this.pagechanged.subscribe((_pageindex) => {
      alert(_pageindex);
    });
  }

  private initHeight() {
    this.tableHeight.y = (window.document.body.clientHeight - (32 + 64 + 69 + 21 + 16 + 49 + 32 + 25 + 7)) + 'px';
  }

  private getData(page, pagesize, searchkey) {
    this.isLoading = true;
    this.roleService.getRoleList(page, pagesize, searchkey)
      .subscribe(
        (data: ResponseData) => {
          console.log(data);
          this.isLoading = false;
          const result = this.toolService.apiResult(data);
          if (result) {
            console.log(result);
            this.roles = [...result.data.rows];
            this.total = result.data.count;
            console.log(this.roles);
          }
        },
        error => {
          this.isLoading = false;
        }
      );
  }
  private refresh() {
    console.log(this.searchkey);
    this.getData(undefined, this.pageSize, this.searchkey);
  }
  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
}
