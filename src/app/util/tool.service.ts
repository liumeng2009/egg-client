import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {ResponseData} from '../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';

import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class ToolService {
  constructor(
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService,
    private http: HttpClient,
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

  upload(url: string, formData: any) {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'authorization': token ? token : ''});
    const req = new HttpRequest('POST', url, formData, {headers: headers});
    return this.http.request(req).pipe(
      tap((data: ResponseData) => {

      }),
      catchError(this.handleError<any>())
    );
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
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      if (error.name === 'HttpErrorResponse') {
        if (error.status === 404) {
          this.message.error('服务器错误：未找到请求路径！');
        } else if (error.status === 0) {
          this.message.error('服务器错误：未响应！');
        } else {
          this.message.error('服务器错误：未知！');
        }

      } else {
        this.message.error(error.statusText);
      }
      return throwError(result as T);

    };
  }
}
