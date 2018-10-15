import {Injectable} from '@angular/core';

import {ResponseData} from '../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';

import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class ToolService {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  apiResult(data: ResponseData) {
    // token不存在，跳转login页面
    if (data.code === 53302) {
      this.message.error(data.error);
      this.router.navigate(['/login']);
    } else if (data.code === 10001) {

    } else if (data.code === 0) {
      if (data.message) {
        this.message.success(data.message);
      }
      return data;
    } else {
      this.message.error(data.error);
    }
  }

  apiException(error: any) {

  }
}
