import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {ToolService} from '../../../../util/tool.service';
import {CategoryService} from '../category.service';
import {ResponseData} from '../../../../bean/responseData';
import {Channel} from '../../../../bean/Channel';
import {RememberService} from '../../../../util/remember.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-article-category-list-page',
  templateUrl: './category-list.component.html',
})

export class CategoryListComponent implements OnInit {
  categories: ArticleCategory[] = [];
  channels: Channel[] = [];
  channelSelected = 0;
  isLoading = false;
  isChannelLoading = false;
  channelList = false;
  channelListError = '';
  categoryDelete: number[] = [];
  isLoadingDelete = false;
  @ViewChild('headerTemplate') headerTemplate: ElementRef;
  showAddBtn = false;
  showEditBtn = false;
  showDelBtn = false;
  scrollHeight = {
    y: '0px',
  }
  constructor(
    private toolService: ToolService,
    private categoryService: CategoryService,
    private rememberService: RememberService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit() {
    this.initHeight();
    this.auth();
    this.channelSelected = this.rememberService.getChannel();
    this.initChannelList().then(
      () => {
        this.getData(this.channelSelected);
      }
    ).catch(() => {});
  }
  private initHeight() {
    this.scrollHeight.y = (window.document.body.clientHeight - 235) + 'px';
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('category');
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
        this.getData(this.channelSelected);
      }
    ).catch(() => {});
  }
  channelSelectChanged(e) {
    this.rememberService.setChannel(e);
    this.getData(e);
  }
  getData(channelId) {
    this.isLoading = true;
    this.categoryService.getCategoryList(channelId).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, true).then(
          (result: ResponseData) => {
            this.categories = [...result.data];
          }
        ).catch(() => {});
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  refresh() {
    this.getData(this.channelSelected);
  }
  private add(parentId) {
    this.router.navigate(['add', {channelId: this.channelSelected, parentId: parentId}], {relativeTo: this.route.parent});
  }
  private edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
  allCheck(e) {
    if (e) {
      for (const user of this.categories) {
        user.checked = true;
      }
    } else {
      for (const user of this.categories) {
        user.checked = false;
      }
    }

  }

  isAllChecked() {
    if (this.categories.length === 0) {
      return false;
    }
    for (const user of this.categories) {
      if (!user.checked) {
        return false;
      }
    }
    return true;
  }
  delete() {
    this.isLoadingDelete = true;
    for (const article of this.categories) {
      if (article.checked) {
        this.categoryDelete.push(article.id);
      }
    }
    this.categoryService.delete(this.categoryDelete).subscribe(
      (data: ResponseData) => {
        this.isLoadingDelete = false;
        this.toolService.apiResult(data, false).then((result: ResponseData) => {
          this.deleteCategoryInArray(this.categoryDelete);
        }).catch(() => {});
      },
      error => {
        this.isLoadingDelete = false;
      }
    );
  }
  private deleteCategoryInArray(ids: number[]) {
    for (const id of ids) {
      this.categories = this.categories.filter(d => d.id !== id);
    }
  }
}
