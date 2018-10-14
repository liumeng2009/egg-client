import {Injectable} from '@angular/core';

import {ResponseData} from '../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable()
export class ToolService {
  constructor(
    private message: NzMessageService,
  ) {

  }

  apiResult(data: ResponseData) {
    if (data.code === 10003) {


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
