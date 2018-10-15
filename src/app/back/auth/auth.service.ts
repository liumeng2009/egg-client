import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

import {EduConfig} from '../../config/config';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

@Injectable()
export class AuthService {

  private checktokenurl = new EduConfig().serverPath + '/api/user/checktoken';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private message: NzMessageService,
  ) {}

  checkToken(): Observable<ResponseData> {
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'authorization': token ? token : ''});
    console.log(this.checktokenurl);
    return this.http.get(this.checktokenurl, {headers: headers})
      .pipe(
        tap((data: ResponseData) => {
          console.log(data);
        }),
        catchError(this.handleError<any>())
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

