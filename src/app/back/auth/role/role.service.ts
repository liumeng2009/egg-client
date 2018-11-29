import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {Role} from '../../../bean/role';
import {ToolService} from '../../../util/tool.service';


@Injectable()
export class RoleService {
  private role_url = EduConfig.serverPath + '/api/role';
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
              private toolService: ToolService,
  ) {}

  getRoleList(page, pagesize, searchkey): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    let pageParams = '',
      pageSizeParams = '',
      searchKeyParams = '';
    if (page) {
      pageParams = page;
    }
    if (pagesize) {
      pageSizeParams = pagesize;
    }
    if (searchkey) {
      searchKeyParams = searchkey;
    }
    const params = new HttpParams().set('page', pageParams)
      .set('pagesize', pageSizeParams)
      .set('searchkey', searchKeyParams);
    return this.http.get(this.role_url, {
      headers: headers,
      params: params,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  create(role: Role, auths: number[]): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.role_url, {role: role, auths: auths}, {headers: headers})
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
    return this.http.get(this.role_url + '/' + id, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  update(role: Role): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.put(this.role_url, role, {headers: headers})
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
    return this.http.post(this.role_url + '/delete', {ids: ids}, {
      headers: headers,
    })
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
