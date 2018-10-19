import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'angular2-cookie/core';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';


@Injectable()
export class UserService {
  private userurl = new EduConfig().serverPath + '/api/user';

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
  ) {}

  getUserList(page, pagesize, searchkey, roles): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    const params = new HttpParams().set('page', page)
      .set('pagesize', pagesize)
      .set('searchkey', searchkey)
      .set('roles', roles);
    console.log(params);
    return this.http.get(this.userurl, {
      headers: headers,
      params: params,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      this.message.error(error.statusText);
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
