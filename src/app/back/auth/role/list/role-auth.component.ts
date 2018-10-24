import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {AuthService} from '../../auth.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';

@Component({
  selector: 'app-role-auth-page',
  templateUrl: './role-auth.component.html',
  styleUrls: ['./role-auth.component.scss']
})

export class RoleAuthComponent implements OnInit {
  @Input() roleId: number;
  isLoading = false;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false },
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false },
  ];
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
        const result = this.toolService.apiResult(data);
        if (result) {
          console.log(result);
        }
      },
      error => {

      }
    );
  }
}
