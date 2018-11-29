import {Injectable} from '@angular/core';
import {CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute
} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../auth/auth.service';
import {ResponseData} from '../../bean/responseData';
import {ToolService} from '../../util/tool.service';
import {RememberService} from '../../util/remember.service';
import {User} from '../../bean/user';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable()
export class TokenGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toolService: ToolService,
    private rememberService: RememberService,
    private message: NzMessageService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(async(resolve, reject) => {
      await this.authService.checkToken().subscribe(
        (data: ResponseData) => {
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              const user: User = {...result.data};
              if (this.rememberService.getUser()) {

              } else {
                this.message.success(this.toolService.getOwnLang('LoginSuccess'));
              }
              this.rememberService.setUser(user);
              resolve(true);
            }
          ).catch(() => {resolve(false); });
        },
        error => {
          resolve(false);
        }
      );
    });
  }
}
