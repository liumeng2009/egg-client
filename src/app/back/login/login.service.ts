import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {EduConfig} from '../../config/config';
import {User} from '../../bean/user';
import {ResponseData} from '../../bean/responseData';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private message: NzMessageService
  ) {}
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private loginurl = EduConfig.serverPath + '/api/login';

  login(user: User): Observable<ResponseData> {
    return this.http.post(this.loginurl, user , {headers: this.headers})
      .pipe(
        tap((data: ResponseData) => {}),
        catchError(this.handleError<ResponseData>())
      );
  }
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.message.error(error.statusText);
      return throwError(result as T);

    };
  }

}
