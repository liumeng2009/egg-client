import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {Article} from '../../../bean/Article';
import {ToolService} from '../../../util/tool.service';


@Injectable()
export class ArticleService {
  private article_url = EduConfig.serverPath + '/api/content/article';
  private elastic_url = EduConfig.serverPath + '/api/elastic';
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
              private toolService: ToolService,
  ) {}

  getArticleList(page, pagesize, searchkey, channelId, categoryId,
    status?, isComment?, isTop?, isRed?, isHot?, isSlide?
  ): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    const params = new HttpParams().set('page', page)
      .set('pagesize', pagesize)
      .set('searchkey', searchkey)
      .set('channelId', channelId)
      .set('categoryId', categoryId)
      .set('status', status)
      .set('isComment', isComment)
      .set('isTop', isTop)
      .set('isRed', isRed)
      .set('isHot', isHot)
      .set('isSlide', isSlide);
    return this.http.get(this.article_url, {
      headers: headers,
      params: params,
    })
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  getArticle(id): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.article_url + '/' + id, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  getArticleByCode(code): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.article_url + '/code/' + code, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  create(article: Article): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.article_url, article, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  update(article: Article): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.put(this.article_url, article, {headers: headers})
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
    return this.http.post(this.article_url + '/delete', {ids: ids}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  auditing(ids): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.article_url + '/auditing', {ids: ids}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  pushElastic(ids: number[]): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.elastic_url, {ids: ids}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  getElastic(id): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.get(this.elastic_url + '/' + id, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  deleteElastic(ids: number[]): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    return this.http.post(this.elastic_url + '/delete', {ids: ids}, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  searchByElastic(searchkey: string): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json',
      'authorization': token ? token : '',
      'Accept-Language' : langHeader});
    const params = new HttpParams().set('searchkey', searchkey)
    return this.http.get(this.elastic_url, {
      headers: headers,
      params: params,
    }).pipe(
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
