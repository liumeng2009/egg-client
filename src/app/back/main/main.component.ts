import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {ToolService} from '../../util/tool.service';
import {Bread} from '../../bean/bread';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {User} from '../../bean/user';
import {RememberService} from './remember.service';

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
  ) {
    this.title.setTitle('首页');
  }

  private collapsed = false;
  private contentStyle = {
    minHeight : '0px',
    backgroundColor : '#fff',
    marginTop: '0px'
  }
  private breadcrumb: Bread[] = [];

  private user: User;
  ngOnInit(): void {
    this.initHeight();
    this.createBreadCrumb();
    this.pathAutoToList();
    this.initLoginUser();
  }
  initHeight() {
    const screenHeight = document.documentElement.clientHeight;
    this.contentStyle.minHeight = screenHeight - (32 + 64 + 69 + 21) + 'px';
    this.contentStyle.marginTop = ( 21 + 32) + 'px';
  }
  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  private createBreadCrumb() {

    this.breadcrumb.splice(0, this.breadcrumb.length);

    let firstBread: Bread = {
      name: '首页',
      path: '/admin'
    };
    this.title.setTitle(firstBread.name);
    this.breadcrumb.push(firstBread);
    if (this.route.firstChild) {
      let secondBread: Bread = {
        name: '',
        path: ''
      };

      this.breadcrumb.push(secondBread);

      this.route.firstChild.data.subscribe((data => {
        this.breadcrumb[1].name = data.name;
        this.title.setTitle(data.name);
      }));

      this.route.firstChild.url.subscribe((url => {
        this.breadcrumb[1].path = this.breadcrumb[0].path + '/' + url[0].path;
      }));
    }
    if (this.route.firstChild && this.route.firstChild.firstChild) {
      let thirdBread: Bread={
        name: '',
        path: ''
      };

      this.breadcrumb.push(thirdBread);

      this.route.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[2].name = data.name
        this.title.setTitle(data.name);
      }));

      this.route.firstChild.firstChild.url.subscribe((url => {
        this.breadcrumb[2].path = this.breadcrumb[1].path + '/' + url[0].path;
      }));
    }

    if (this.route.firstChild && this.route.firstChild.firstChild && this.route.firstChild.firstChild.firstChild) {
      let fourBread: Bread = {
        name: '',
        path: ''
      };

      this.breadcrumb.push(fourBread);

      this.route.firstChild.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[3].name = data.name
        this.title.setTitle(this.breadcrumb[2].name + '-' + data.name);
      }));

      this.route.firstChild.firstChild.firstChild.url.subscribe((url => {
        this.breadcrumb[3].path = this.breadcrumb[2].path + '/' + url[0].path;
      }));
    }

  }

  // 大多数功能页面需要直接跳转到他的子路由list上
  private pathAutoToList() {
    const url = this.location.path();
    if (url === '/admin/auth/user') {
      this.router.navigateByUrl('/admin/auth/user/list');
    }

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          let urlNow = event.url;
          urlNow = urlNow.substring(1, urlNow.length);
          if (event.url === '/admin/auth/user') {
            this.router.navigateByUrl('/admin/auth/user/list').then(() => {
              this.createBreadCrumb();
            });
          }
        }
      });
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
  }
}
