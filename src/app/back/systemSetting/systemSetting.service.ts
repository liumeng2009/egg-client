import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {EduConfig} from '../../config/config';
import {ResponseData} from '../../bean/responseData';
import { NzMessageService } from 'ng-zorro-antd';
import {ToolService} from '../../util/tool.service';
import {CookieService} from 'ngx-cookie';

@Injectable({
  providedIn: 'root',
})
export class SystemSettingService {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private toolService: ToolService,
    private cookieService: CookieService,
  ) {}
  private elastic_url = EduConfig.serverPath + '/api/elastic';
  createAllElastic(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    return this.http.get(this.elastic_url + '/createAll', {
      headers: headers,
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
