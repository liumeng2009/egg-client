import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {User} from '../../../bean/user';
import {ToolService} from '../../../util/tool.service';


@Injectable()
export class UserService {
  private user_url = EduConfig.serverPath + '/api/user';
  private avatar_url = EduConfig.serverPath + '/api/avatar';

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
              private toolService: ToolService,
  ) {}

  getUserList(page, pagesize, searchkey, roles): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    const params = new HttpParams().set('page', page)
      .set('pagesize', pagesize)
      .set('searchkey', searchkey)
      .set('roles', roles);
    return this.http.get(this.user_url, {
      headers: headers,
      params: params,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  show(id): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.user_url + '/' + id, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  showOwn(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.user_url + '/show/own', {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  getAvatarList(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.avatar_url, {
      headers: headers,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  create(user: User): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.user_url, user, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  update(user: User): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.put(this.user_url, user, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  delete(ids): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.user_url + '/delete', {ids: ids}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  changePassword(password: any): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.put(this.user_url + '/changepassword', password, {headers: headers})
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
