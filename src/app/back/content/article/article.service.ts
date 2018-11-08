import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import {EduConfig} from '../../../config/config';

import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../../../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {Article} from '../../../bean/Article';


@Injectable()
export class ArticleService {
  private article_url = EduConfig.serverPath + '/api/content/article';
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
  ) {}

  getArticleList(page, pagesize, searchkey, channelId, categoryId): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    const params = new HttpParams().set('page', page)
      .set('pagesize', pagesize)
      .set('searchkey', searchkey)
      .set('channelId', channelId)
      .set('categoryId', categoryId);
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
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.get(this.article_url + '/' + id, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }

  create(article: Article): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.post(this.article_url, article, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {

        }),
        catchError(this.handleError<any>())
      );
  }
  update(article: Article): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.put(this.article_url, article, {headers: headers})
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
