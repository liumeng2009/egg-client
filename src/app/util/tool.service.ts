import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ResponseData} from '../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';

import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class ToolService {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService,
  ) {

  }
  // infoHidden 比如某个页面的下拉框的数据源出现异常，不希望也弹出错误提示。
  apiResult(data: ResponseData, infoHidden) {
    return new Promise((resolve, reject) => {
      if (data.code === 53302) {
        this.message.error(data.error + '，即将重新登录！');
        setTimeout(() => {this.gotoLoginPage(); }, 500);
        reject();
      } else if (data.code === 0) {
        if (data.message) {
          this.message.success(data.message);
        }
        resolve(data);
      } else if (data.code === 422) {
        if (!infoHidden) {
          this.message.error('传入的参数异常');
        }
        reject('传入的参数异常');
      } else {
        if (!infoHidden) {
          this.message.error(data.error);
        }
        reject(data.error);
      }
    });
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
      this.router.navigate(['/admin/login'], {queryParams: queryParams});
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
}
