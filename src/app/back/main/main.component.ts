import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {ToolService} from '../../util/tool.service';
import {Bread} from '../../bean/bread';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {User} from '../../bean/user';
import {RememberService} from './remember.service';
import {CookieService} from 'ngx-cookie';
import {NzMessageService} from 'ng-zorro-antd';
import {EduConfig} from '../../config/config';
import {RouteList} from '../../app-routes';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {


  constructor(
    private title: Title,
    private toolService: ToolService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private rememberService: RememberService,
    private cookieService: CookieService,
    private message: NzMessageService,
  ) {
    this.title.setTitle('首页');
  }

  collapsed = false;
  contentStyle = {
    minHeight : '0px',
    backgroundColor : '#fff',
    marginTop: '0px'
  }
  breadcrumb: Bread[] = [];
  user: User;
  baseImageUrl: string = EduConfig.serverPath;
  avatarImagePath = '';
  routesMenuUse: any[] = [];
  ngOnInit(): void {
    // 额，算是深拷贝吧。。。。
    // this.routesMenuUse = JSON.parse(JSON.stringify(this.router.config));
    this.routesMenuUse = new RouteList().rl;
    this.initHeight();
    this.createBreadCrumb();
    this.pathAutoToList();
    this.initLoginUser();
    // this.router.navigateByUrl('/admin/total');

  }
  initHeight() {
    const screenHeight = document.documentElement.clientHeight;
    this.contentStyle.minHeight = screenHeight - (64 + 64 + 8) + 'px';
    this.contentStyle.marginTop = '64px';
  }
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  // 这个方法中怪异的一串firstChild应该是因为懒加载的原因，用懒加载的模块，他的上层parent是一个component = null 的东西
  // 希望有好的方案
  private createBreadCrumb() {
    this.breadcrumb.splice(0, this.breadcrumb.length);

    const firstBread: Bread = {
      name: '首页',
      path: '/admin',
      disabled: false,
    };
    this.title.setTitle(firstBread.name);
    this.breadcrumb.push(firstBread);
    if (this.route.firstChild && this.route.firstChild.firstChild) {
      const secondBread: Bread = {
        name: '',
        path: '',
        disabled: false,
      };

      this.breadcrumb.push(secondBread);

      this.route.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[1].name = data.name;
        this.title.setTitle(data.name);
      }));

      this.route.firstChild.url.subscribe((url => {
        this.breadcrumb[1].path = this.breadcrumb[0].path + '/' + url[0].path;
      }));
    } else {
      this.breadcrumb[0].disabled = true;
      return ;
    }
    if (this.route.firstChild && this.route.firstChild.firstChild && this.route.firstChild.firstChild.firstChild
      && this.route.firstChild.firstChild.firstChild.firstChild) {
      const thirdBread: Bread = {
        name: '',
        path: '',
        disabled: false,
      };

      this.breadcrumb.push(thirdBread);

      this.route.firstChild.firstChild.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[2].name = data.name;
        this.title.setTitle(data.name);
      }));

      this.route.firstChild.firstChild.firstChild.url.subscribe((url => {
        this.breadcrumb[2].path = this.breadcrumb[1].path + '/' + url[0].path;
      }));
    } else {
      this.breadcrumb[1].disabled = true;
      return ;
    }

    if (this.route.firstChild && this.route.firstChild.firstChild && this.route.firstChild.firstChild.firstChild
      && this.route.firstChild.firstChild.firstChild.firstChild
       && this.route.firstChild.firstChild.firstChild.firstChild.firstChild) {
      const fourBread: Bread = {
        name: '',
        path: '',
        disabled: false,
      };

      this.breadcrumb.push(fourBread);

      this.route.firstChild.firstChild.firstChild.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[3].name = data.name;
        this.title.setTitle(this.breadcrumb[2].name + '-' + data.name);
      }));

      this.route.firstChild.firstChild.firstChild.firstChild.firstChild.url.subscribe((url => {
        this.breadcrumb[3].path = this.breadcrumb[2].path + '/' + url[0].path;
      }));
    } else {
      this.breadcrumb[2].disabled = true;
    }
    if (this.breadcrumb.length > 3) {
      this.breadcrumb[3].disabled = true;
      return ;
    }
  }

  // 根据角色，来改变angular的路由配置
  private fixRouteConfig(auths) {
    // auths与route作比较，auths中没有的，从route中删除
    // 第一层
    const cfg = this.routesMenuUse;
    for (let i = 1; i < cfg.length; i++) {
      if (this.isExistInRouteConfig(cfg[i], auths)) {

      } else {
        // 没有菜单权限，就把这个分支从config删除掉
        cfg.splice(i, 1);
        i--;
      }
      // 第二层
      const cfgChildren = cfg[i].children;
      if (cfgChildren) {
        for (let j = 0; j < cfgChildren.length; j++) {
          if (this.isExistInRouteConfig(cfgChildren[j], auths)) {

          } else {
            // 没有菜单权限，就把这个分支从config删除掉
            cfgChildren.splice(j, 1);
            j--;
          }
        }
      }
    }
  }

  private pathAutoToList() {
    const url = this.location.path();
    if (url === '/admin') {
      this.router.navigateByUrl('/admin/total').then(() => {
        this.createBreadCrumb();
      });
    }
    if (url === '/admin/auth/user') {
      this.router.navigateByUrl('/admin/auth/user/list').then(() => {
        this.createBreadCrumb();
      });
    }
    if (url === '/admin/auth/role') {
      this.router.navigateByUrl('/admin/auth/role/list').then(() => {
        this.createBreadCrumb();
      });
    }
    if (url === '/admin/content/category') {
      this.router.navigateByUrl('/admin/content/category/list').then(() => {
        this.createBreadCrumb();
      });
    }
    if (url === '/admin/content/article') {
      this.router.navigateByUrl('/admin/content/article/list').then(() => {
        this.createBreadCrumb();
      });
    }
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          // let urlNow = event.url;
          // urlNow = urlNow.substring(1, urlNow.length);
          if (event.url === '/admin') {
            this.router.navigateByUrl('/admin/total').then(() => {
              this.createBreadCrumb();
            });
          }
          if (event.url === '/admin/auth/user') {
            this.router.navigateByUrl('/admin/auth/user/list').then(() => {
              this.createBreadCrumb();
            });
          }
          if (event.url === '/admin/auth/role') {
            this.router.navigateByUrl('/admin/auth/role/list').then(() => {
              this.createBreadCrumb();
            });
          }
          if (event.url === '/admin/content/category') {
            this.router.navigateByUrl('/admin/content/category/list').then(() => {
              this.createBreadCrumb();
            });
          }
          if (event.url === '/admin/content/article') {
            this.router.navigateByUrl('/admin/content/article/list').then(() => {
              this.createBreadCrumb();
            });
          }
          this.createBreadCrumb();
        }
      });
  }

  private isExistInRouteConfig(pathObj, auths) {
    for (const auth of auths) {
      if (pathObj.path === auth.auth_opInFunc.auth_function.code && auth.auth_opInFunc.auth_operate.code === 'menu') {
        return true;
      }
    }
    return false;
  }

  private checkSelected(path) {
    const url = this.location.path();
    if (url.indexOf(path) > -1) {
      return true;
    } else {
      return false;
    }
  }

  private checkOpen(path) {
    const url = this.location.path();
    if (url.indexOf(path) > -1) {
      return true;
    } else {
      return false;
    }
  }

  private clickSubMenuTitle(path) {
    this.router.navigateByUrl('/admin/' + path).then(() => {
      this.createBreadCrumb();
    });
  }
  private clickStop(e) {
    e.stopPropagation();
  }

  private initLoginUser() {
    this.user = this.rememberService.getUser();
    this.fixRouteConfig(this.user.role.auth_authInRoles);
  }

  getAvatarImageUrl(user) {
    if (user) {
      if (user.avatar) {
        if (user.avatarUseSys === 0) {
          // 说明是上传的图片
          return this.baseImageUrl + '/uploads/' + user.avatar;
        } else {
          return this.baseImageUrl + user.avatar;
        }
      } else {
        return this.avatarImagePath;
      }
    }
  }

  confirmExit() {
      this.cookieService.remove('eduToken');
      this.message.warning(EduConfig.closing);
      setTimeout(() => {
        // this.router.navigateByUrl('admin/login');
        this.gotoLoginPage();
      }, 1000);
  }
  private rememberUrl() {
    return this.location.path();
  }
  private gotoLoginPage() {
    const urlTree = this.router.parseUrl(this.router.url);
    const queryParams = urlTree.queryParams;
    const rememberUrl = this.rememberUrl();
    if (queryParams.redirectTo) {

    } else {
      queryParams.redirectTo = rememberUrl;
    }
    if (queryParams.redirectTo !== '' && queryParams.redirectTo.indexOf('login') < 0) {
      this.router.navigate(['/admin/login'], {queryParams: queryParams});
    } else {
      this.router.navigate(['/admin/login']);
    }
  }
  back() {
    window.history.go(-1);
  }
}
