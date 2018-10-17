import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Role} from '../../../../bean/role';
import {RoleService} from '../role.service';
import {ToolService} from '../../../../util/tool.service';
import {EduConfig} from '../../../../config/config';
import {ResponseData} from '../../../../bean/responseData';

@Component({
  selector: 'app-role-list-page',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})

export class RoleListComponent implements OnInit {

  private height = 0;
  private result;
  private isLoading = true;
  private roles: Role[];

  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
  ) {}

  ngOnInit() {
    //this.height=(window.document.body.clientHeight-70-56-50-20-27);
    this.getData();
  }

  private getData() {
    this.roleService.getRoleList(undefined, undefined, undefined)
      .subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
            this.roles =
          }
        },
        error => {

        }
      );
  }
  private refresh() {

  }
  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
}
