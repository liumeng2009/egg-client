import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {Role} from '../../../bean/role';


@Injectable()
export class RoleService {
  private role_url = new EduConfig().serverPath + '/api/role';
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
  ) {}

  getRoleList(page, pagesize, searchkey): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
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
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.post(this.role_url, {role: role, auths: auths}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  show(id): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.get(this.role_url + '/' + id, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  update(role: Role): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.put(this.role_url, role, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  delete(ids): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
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

/*  getRole(id):Promise<ResponseData>{
    let url=this.geturl+'/'+id
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(role:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.addurl, role, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  edit(role:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.editurl, role, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  delete(id:string):Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
        .get(this.deleteurl+'/'+id,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  authInRoleCreate(authInRole:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.authInRoleAddUrl, authInRole, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  authInRoleDelete(authInRole:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.authInRoleDeleteUrl, authInRole, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  authInRoleList(roleId:string):Promise<ResponseData>{
    let url=this.authInRoleListUrl+'/'+roleId;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }*/
}
