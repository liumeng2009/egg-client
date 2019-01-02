import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from './systemSetting.service';
import {ToolService} from '../../util/tool.service';
import {ResponseData} from '../../bean/responseData';
import {RememberService} from '../../util/remember.service';

@Component({
  templateUrl: './systemSetting.component.html',
  selector: 'app-system-setting-page',
  styleUrls: ['./systemSetting.component.scss'],
})

export class SystemSettingComponent implements OnInit {
  formHeight = {
    height : '0px'
  }
  showElasticTab = false;
  constructor(
    private systemSettingService: SystemSettingService,
    private toolService: ToolService,
    private rememberService: RememberService,
  ) {}
  ngOnInit() {
    this.initHeight();
    this.auth();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69)) + 'px';
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('elastic');
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
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.showElasticTab = true;
      }
    }
  }
  createAllElastic() {
    this.systemSettingService.createAllElastic().subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, false).then(

        ).catch(() => {});
      },
      error => {

      }
    );
  }
}
