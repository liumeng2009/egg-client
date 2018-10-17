import {Injectable} from '@angular/core';
import {CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  ActivatedRoute
} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../auth/auth.service';
import {ResponseData} from '../../bean/responseData';
import {ToolService} from '../../util/tool.service';
import {RememberService} from './remember.service';
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
          const result = this.toolService.apiResult(data);
          if (result) {
            const user: User = {...result.data};
            if (this.rememberService.getUser()) {

            } else {
              this.message.success((user.realname ? user.realname : user.mobile) + '，登录成功！');
            }
            this.rememberService.setUser(user);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          resolve(false);
        }
      );
    });
  }

/*  private rememberUrl(){
    let url=this.location.path();
    return url;
  }

  private gotoLoginPage(data){
    //this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    let rememberUrl=this.rememberUrl();
    if(queryParams.redirectTo){

    }
    else{
      queryParams.redirectTo=rememberUrl;
    }
    if(queryParams.redirectTo!=''&&queryParams.redirectTo.indexOf('login')<0){
      this.router.navigate(['/login'],{queryParams:queryParams});
    }
    else{
      this.router.navigate(['/login']);
    }
  }*/
}
