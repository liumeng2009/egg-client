import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EduConfig} from '../../../../config/config';
import {Article} from '../../../../bean/Article';
import {ResponseData} from '../../../../bean/responseData';
import {RememberService} from '../../../main/remember.service';
import {ToolService} from '../../../../util/tool.service';
import {CategoryService} from '../../category/category.service';
import {Channel} from '../../../../bean/Channel';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleCategory} from '../../../../bean/ArticleCategory';

@Component({
  selector: 'app-article-list-page',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})

export class ArticleListComponent implements OnInit {
  searchkey = '';
  isLoading = false;
  noResult = new EduConfig().noResult;
  articles: Article[] = [];
  userDelete: number[] = [];
  channelSelected = 0;
  channels: Channel[] = [];
  isChannelLoading = false;
  channelList = false;
  channelListError = '';
  categories: ArticleCategory[] = [];
  isCategoryLoading = false;
  categoryList = false;
  categoryListError = '';
  categorySelected = 0;
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  total = 0;
  pageSize = new EduConfig().pageSize;
  pageIndex = 1;
  isLoadingDelete = false;
  showAddBtn = false;
  showEditBtn = false;
  showDelBtn = false;
  showAuditingBtn = false;
  constructor(
    private rememberService: RememberService,
    private toolService: ToolService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.auth();
    this.initChannelList().then(
      () => {
        this.initCategoryList(this.channelSelected);
      }
    ).catch(() => {});
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('article');
      this.initComponentAuth(authArray);
    }
  }
  private initAuth(functioncode) {
    const resultArray = [];
    const user = this.rememberService.getUser();
    if (user && user.role && user.role.auth_authInRoles) {
      const auths = user.role.auth_authInRoles;
      for (const auth of auths) {
        if (auth.auth_opInFunc
          && auth.auth_opInFunc.auth_function
          && auth.auth_opInFunc.auth_function.code
          && auth.auth_opInFunc.auth_function.code === functioncode
        ) {
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  // 根据auth数组，判断页面一些可操作组件的可用/不可用状态
  private initComponentAuth(authArray) {
    for (const auth of authArray) {
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'add') {
        this.showAddBtn = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.showEditBtn = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'delete') {
        this.showDelBtn = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'auditing') {
        this.showAuditingBtn = true;
      }
    }
  }

  initChannelList() {
    this.isChannelLoading = true;
    return new Promise((resolve, reject) => {
      this.categoryService.getChannelList().subscribe(
        (data: ResponseData) => {
          this.isChannelLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.channels = [...result.data];
              this.channelList = true;
              if (this.channels.length > 0) {
                this.channelSelected = this.channels[0].id;
              }
              resolve();
            }
          ).catch((error) => {
            this.channelList = false;
            this.channelListError = error;
            reject();
          });
        },
        error => {
          this.channelList = false;
          this.isChannelLoading = false;
          reject();
        }
      );
    });
  }
  channelListRefresh() {
    this.initChannelList().then(
      () => {
        this.initCategoryList(this.channelSelected);
      }
    ).catch(() => {});
  }
  channelSelectChanged(e) {
    this.initCategoryList(e);
  }
  categorySelectChanged(e) {

  }
  initCategoryList(channelId) {
    this.categoryService.getCategoryList(channelId).subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, true).then(
          (result: ResponseData) => {
            this.categories = [...result.data];
            const categoryTop = new ArticleCategory(0, '所有分类', '', channelId,
              0, '', -1, 0, false);
            this.categories.unshift(categoryTop);
            this.categoryList = true;
          }
        ).catch((err) => {
          this.categoryList = false;
          this.categoryListError = err;
        });
      },
      error => {
        this.categoryList = false;
        this.categoryListError = error;
      }
    );
  }
  refresh() {

  }
  add() {
    this.router.navigate(['add', {channelId: this.channelSelected}], {relativeTo: this.route.parent});
  }
  edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
  allCheck(e) {
    if (e) {
      for (const user of this.articles) {
        user.checked = true;
      }
    } else {
      for (const user of this.articles) {
        user.checked = false;
      }
    }

  }
  refreshNoCategory() {

  }

  isAllChecked() {
    if (this.articles.length === 0) {
      return false;
    }
    for (const user of this.articles) {
      if (!user.checked) {
        return false;
      }
    }
    return true;
  }
}
