import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EduConfig} from '../../../../config/config';
import {Article, ArticleProperty} from '../../../../bean/Article';
import {ResponseData} from '../../../../bean/responseData';
import {RememberService} from '../../../main/remember.service';
import {ToolService} from '../../../../util/tool.service';
import {CategoryService} from '../../category/category.service';
import {Channel} from '../../../../bean/Channel';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {ArticleService} from '../article.service';
import * as moment from 'moment';

@Component({
  selector: 'app-article-list-page',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})

export class ArticleListComponent implements OnInit {
  searchkey = '';
  isLoading = false;
  noResult = EduConfig.noResult;
  articles: Article[] = [];
  articleDelete: number[] = [];
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
  pageSize = EduConfig.pageSize;
  pageIndex = 1;
  isLoadingDelete = false;
  articleAuditing: number[] = [];
  isLoadingAuditing = false;
  showAddBtn = false;
  showEditBtn = false;
  showDelBtn = false;
  showAuditingBtn = false;
  articleProperties: ArticleProperty[] = [];
  propFilterStyle = {
    color: '#bfbfbf',
  }

  scrollHeight = {
    y: '0px',
  }
  serverPath = EduConfig.serverPath;
  constructor(
    private rememberService: RememberService,
    private toolService: ToolService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
  ) {}
  ngOnInit() {
    setTimeout(() => {
      this.initHeight();
    }, 0);
    this.auth();
    this.initArticleProperties();
    this.channelSelected = this.rememberService.getChannel();
    this.initChannelList().then(
      () => {
        this.initCategoryList(this.channelSelected).then(() => {
          this.getData();
        }).catch(() => {});
      }
    ).catch(() => {});
  }
  private initHeight() {
    this.scrollHeight.y = (window.document.body.clientHeight - 290) + 'px';
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
/*              if (this.channels.length > 0) {
                this.channelSelected = this.channels[0].id;
              }*/
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
    this.rememberService.setChannel(e);
    this.initCategoryList(e).then(() => {
      this.getData();
    }).catch(() => {});
  }
  categorySelectChanged(e) {
    this.categorySelected = e;
    this.getData();
  }
  initCategoryList(channelId) {
    return new Promise((resolve, reject) => {
      this.categoryService.getCategoryList(channelId).subscribe(
        (data: ResponseData) => {
          this.toolService.apiResult(data, true).then(
            (result: ResponseData) => {
              this.categories = [...result.data];
              const categoryTop = new ArticleCategory(0, '所有分类', '', channelId,
                0, '', -1, 0, false);
              this.categories.unshift(categoryTop);
              this.categoryList = true;
              this.categorySelected = 0;
              resolve();
            }
          ).catch((err) => {
            this.categoryList = false;
            this.categoryListError = err;
            reject();
          });
        },
        error => {
          this.categoryList = false;
          this.categoryListError = error;
          reject();
        }
      );
    });
  }
  getAllCategory(categoryId) {
    let index = 0;
    let categoryString = '';
    for (const cate of this.categories) {
      if (cate.id === categoryId) {
        // 从这个节点开始往上找，直到level===0，这就是所有参数所有的父亲节点了
        for (let i = index; i > -1; i--) {
          if (i === index) {
            categoryString = this.categories[i].name;
          } else {
            categoryString = this.categories[i].name + '-' + categoryString;
          }
          if (this.categories[i].level === 0) {
            break;
          }
        }
      break;
      }
      index++;
    }
    return categoryString;
  }
  initArticleProperties() {
    const prop_status_1 = new ArticleProperty('已审核', 'status', true);
    const prop_status_2 = new ArticleProperty('待审核', 'status', true);
    const prop_isComment = new ArticleProperty('允许评论', 'isComment', false);
    const prop_isTop = new ArticleProperty('置顶', 'isTop', false);
    const prop_isHot = new ArticleProperty('热门', 'isHot', false);
    const prop_isRed = new ArticleProperty('推荐', 'isRed', false);
    const prop_isSlide = new ArticleProperty('幻灯片', 'isSlide', false);
    this.articleProperties.push(prop_status_1);
    this.articleProperties.push(prop_status_2);
    this.articleProperties.push(prop_isComment);
    this.articleProperties.push(prop_isTop);
    this.articleProperties.push(prop_isHot);
    this.articleProperties.push(prop_isRed);
    this.articleProperties.push(prop_isSlide);
  }
  filterByProp() {
    if (this.articleProperties[0].checked === true &&
      this.articleProperties[1].checked === true &&
      this.articleProperties[2].checked === false &&
      this.articleProperties[3].checked === false &&
      this.articleProperties[4].checked === false &&
      this.articleProperties[5].checked === false &&
      this.articleProperties[6].checked === false) {
      this.propFilterStyle.color = '#bfbfbf';
    } else {
      this.propFilterStyle.color = '#1890ff';
    }
    this.getData();
  }
  refreshNoProp() {
    this.articleProperties[0].checked = true,
    this.articleProperties[1].checked = true,
    this.articleProperties[2].checked = false,
    this.articleProperties[3].checked = false,
    this.articleProperties[4].checked = false,
    this.articleProperties[5].checked = false,
    this.articleProperties[6].checked = false,
    this.propFilterStyle.color = '#bfbfbf';
    this.getData();
  }

  refreshNoSearchKey() {
    this.searchkey = '';
    this.getData();
  }
  private getData() {
    this.isLoading = true;
    let status = 999;
    if (this.articleProperties[0].checked) {
      status = 1;
    }
    if (this.articleProperties[1].checked) {
      status = 2;
    }
    // 3代表status === 1 or status === 2
    if (this.articleProperties[1].checked && this.articleProperties[0].checked) {
      status = 3;
    }
    this.articleService.getArticleList(this.pageIndex, this.pageSize, this.searchkey,
      this.channelSelected, this.categorySelected, status,
      this.articleProperties[2].checked ? this.articleProperties[2].checked : undefined,
      this.articleProperties[3].checked ? this.articleProperties[3].checked : undefined,
      this.articleProperties[4].checked ? this.articleProperties[4].checked : undefined,
      this.articleProperties[5].checked ? this.articleProperties[5].checked : undefined,
      this.articleProperties[6].checked ? this.articleProperties[6].checked : undefined,
    ).subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, false).then((result: ResponseData) => {
          this.isLoading = false;
          this.articles = [...result.data.rows];
          this.total = result.data.count;
        });
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  refresh() {
    this.getData();
  }
  pageChanged(e) {
    this.pageIndex = e;
    this.getData();
  }
  add() {
    this.router.navigate(['add', {channelId: this.channelSelected}], {relativeTo: this.route.parent});
  }
  edit(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }
  copy(id) {

  }
  auditing() {
    this.articleAuditing.splice(0, this.articleAuditing.length);
    this.isLoadingAuditing = true;
    for (const article of this.articles) {
      if (article.checked) {
        this.articleAuditing.push(article.id);
      }
    }
    this.articleService.auditing(this.articleAuditing).subscribe(
      (data: ResponseData) => {
        this.isLoadingAuditing = false;
        this.toolService.apiResult(data, false).then((result: ResponseData) => {
          this.auditingArticleInArray(this.articleAuditing);
        }).catch(() => {});
      },
      error => {
        this.isLoadingAuditing = false;
      }
    );
  }
  private auditingArticleInArray(ids: number[]) {
    for (const id of ids) {
      for (const per of this.articles) {
        if (per.id === id) {
          per.status = 1;
          break;
        }
      }
    }
  }
  delete() {
    this.isLoadingDelete = true;
    for (const article of this.articles) {
      if (article.checked) {
        this.articleDelete.push(article.id);
      }
    }
    this.articleService.delete(this.articleDelete).subscribe(
      (data: ResponseData) => {
        this.isLoadingDelete = false;
        this.toolService.apiResult(data, false).then((result: ResponseData) => {
          this.deleteArticleInArray(this.articleDelete);
        }).catch(() => {});
      },
      error => {
        this.isLoadingDelete = false;
      }
    );
  }
  private deleteArticleInArray(ids: number[]) {
    for (const id of ids) {
      this.articles = this.articles.filter(d => d.id !== id);
      this.total--;
    }
    if (this.articles.length === 0) {
      // 被删完了,往前页跳
      if (this.pageIndex > 1) {
        this.pageIndex--;
        this.getData();
      }
    }
  }
  tagChanged(e, article, propertyName) {
    for (const p in article) {
      if (p === propertyName) {
        article[p] = !article[p];
        article.publishAt = moment(article.publishAt).format('YYYY-MM-DD HH:mm:ss');
        this.articleService.update(article).subscribe(
          (data: ResponseData) => {
            this.toolService.apiResult(data, false).then((result: ResponseData) => {

            }).catch(() => {
              article[p] = !e;
            });
          },
          error => {
            article[p] = !e;
          }
        );
        break;
      }
    }
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

  sortChanged(e, article: Article) {
    console.log(e);
    article.sort = e;
    article.publishAt = moment(article.publishAt).format('YYYY-MM-DD HH:mm:ss');
    this.articleService.update(article).subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, false).then((result: ResponseData) => {

        }).catch(() => {
          article.sort = e;
        });
      },
      error => {
        // article.sort = !e;
      }
    );
  }
  pushAlgolia() {
    this.articleService.pushAlgolia().subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, false).then((result: ResponseData) => {

        }).catch(() => {

        });
      },
      error => {

      }
    );
  }
}
