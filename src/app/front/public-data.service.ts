import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {EduConfig} from '../config/config';
import {CookieService} from 'ngx-cookie';
import {ResponseData} from '../bean/responseData';
import {NzMessageService} from 'ng-zorro-antd';
import {ToolService} from '../util/tool.service';


@Injectable()
export class PublicDataService {
  private elastic_url = EduConfig.serverPath + '/api/elastic';
  private public_url = EduConfig.serverPath + '/api/public';
  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private message: NzMessageService,
              private toolService: ToolService,
  ) {}
  searchByElastic(searchkey: string): Observable<ResponseData> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
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

  articleIndexByCode(code) {
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept-Language' : langHeader});
    const params = new HttpParams().set('code', code)
    return this.http.get(this.public_url + '/article', {
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
