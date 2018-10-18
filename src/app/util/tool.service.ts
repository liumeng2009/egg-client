import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ResponseData} from '../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';

import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class ToolService {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {

  }

  apiResult(data: ResponseData) {
    // token不存在，跳转login页面
    if (data.code === 53302) {
      this.message.error(data.error + '，即将重新登录！');
      setTimeout(() => {
        this.gotoLoginPage();
      }, 2000);
    } else if (data.code === 0) {
      if (data.message) {
        this.message.success(data.message);
      }
      return data;
    } else if (data.code === 422) {
      // 服务器内部错误
      this.message.error('传入的参数异常');
    } else {
      console.log(data);
      this.message.error(data.error);
    }
  }

  apiException(error: any) {

  }

  private rememberUrl() {
    return this.location.path();
  }
  private gotoLoginPage() {
    const urlTree = this.router.parseUrl(this.router.url);
    const queryParams = urlTree.queryParams;
    const rememberUrl = this.rememberUrl();
    if (queryParams.redirectTo) {

    } else {
      queryParams.redirectTo = rememberUrl;
    }
    if (queryParams.redirectTo !== '' && queryParams.redirectTo.indexOf('login') < 0) {
      this.router.navigate(['/login'], {queryParams: queryParams});
    } else {
      this.router.navigate(['/login']);
    }
  }
}
