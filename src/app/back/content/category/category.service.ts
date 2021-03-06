import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {ArticleCategory} from '../../../bean/ArticleCategory';
import {ToolService} from '../../../util/tool.service';


@Injectable()
export class CategoryService {
  private channel_url = EduConfig.serverPath + '/api/content/channel';
  private category_url = EduConfig.serverPath + '/api/content/category';
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
              private toolService: ToolService,
  ) {}

  getChannelList(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.channel_url, {
      headers: headers,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  showChannel(channelId): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.channel_url + '/' + channelId, {
      headers: headers,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  getCategoryList(channelId): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    const params = new HttpParams().set('channelId', channelId);
    return this.http.get(this.category_url, {
      headers: headers,
      params: params,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  create(category: ArticleCategory): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.category_url, category, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  update(category: ArticleCategory): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.put(this.category_url, category, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  getCategory(id): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.category_url + '/' + id, {headers: headers})
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
    return this.http.post(this.category_url + '/delete', {ids: ids}, {headers: headers})
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
