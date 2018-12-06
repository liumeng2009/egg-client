import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import {EduConfig} from '../../config/config';


import {ResponseData} from '../../bean/responseData';
import {Auth} from '../../bean/auth';
import {CookieService} from 'ngx-cookie';
import {ToolService} from '../../util/tool.service';

@Injectable()
export class AuthService {

  private checktokenurl = EduConfig.serverPath + '/api/user/checktoken';
  private auth_url = EduConfig.serverPath + '/api/auth';
  private auth_check_url = EduConfig.serverPath + '/api/checkauth';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private message: NzMessageService,
    private toolService: ToolService,
  ) {}

  checkToken(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    console.log(langHeader);
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.checktokenurl, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  getAuthList(roleId): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '', 'Accept-Language' : langHeader});
    return this.http.get(this.auth_url + '/' + roleId, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  create(auth: Auth): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.auth_url, auth, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  destroy(auth: Auth): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.delete(this.auth_url + '/' + auth.roleId + '/' + auth.authId, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  checkAuth(func, op): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.auth_check_url, {func: func, op: op}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
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

