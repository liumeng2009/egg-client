import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {EduConfig} from '../../config/config';
import {User} from '../../bean/user';
import {ResponseData} from '../../bean/responseData';
import { NzMessageService } from 'ng-zorro-antd';
import {RememberService} from '../../util/remember.service';
import {ToolService} from '../../util/tool.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private toolService: ToolService,
  ) {}
  private loginurl = EduConfig.serverPath + '/api/login';
  login(user: User): Observable<ResponseData> {
    const langHeader = this.toolService.getHeaderlang();
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept-Language' : langHeader});
    return this.http.post(this.loginurl, user , {headers: headers})
      .pipe(
        tap((data: ResponseData) => {}),
        catchError(this.handleError<ResponseData>())
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
