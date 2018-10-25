import {Injectable} from '@angular/core';
import {CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute
} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../auth/auth.service';
import {ToolService} from '../../util/tool.service';
import {ResponseData} from '../../bean/responseData';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toolService: ToolService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let func = '';
    let op = '';
    // 处理，得到路径对应的func和op
    const path = route.routeConfig.path;

    switch (path) {
      case 'add':
        func = route.parent.routeConfig.path;
        op = 'add';
        break;
      case 'list':
        func = route.parent.routeConfig.path;
        op = 'list';
        break;
      case ':id':
        // 编辑
        func = route.parent.routeConfig.path;
        op = 'list';
        break;
      default:
        func = route.routeConfig.path;
        op = 'menu';
        break;
    }
    return new Promise<boolean>(async (resolve, reject) => {
      await this.authService.checkAuth(func, op).subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
            console.log('验证权限' + func + op + '通过');
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
}
