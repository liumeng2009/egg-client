import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import {EduConfig} from '../../config/config';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

@Injectable()
export class AuthService {

  private checktokenurl = new EduConfig().serverPath + '/api/user/checktoken';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private message: NzMessageService,
  ) {}

  checkToken(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.get(this.checktokenurl, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }


  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
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

