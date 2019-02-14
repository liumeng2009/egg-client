import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EduConfig} from '../../../../config/config';
import {Article, ArticleProperty} from '../../../../bean/Article';
import {ResponseData} from '../../../../bean/responseData';
import {RememberService} from '../../../../util/remember.service';
import {ToolService} from '../../../../util/tool.service';
import {CategoryService} from '../../category/category.service';
import {Channel} from '../../../../bean/Channel';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {FileService} from '../file.service';
import {EN} from '../../../../config/en';
import {ZH} from '../../../../config/zh';
import * as moment from 'moment';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
@Component({
  selector: 'app-file-list-page',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})

export class FileListComponent implements OnInit {
  searchkey = '';
  isLoading = false;
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
  categoryListError = 'Channel data not loaded.';
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
  };

  scrollHeight = {
    y: '0px',
  };
  serverPath = EduConfig.serverPath;
  nodes = [ {
    title   : 'parent 1',
    key     : '100',
    expanded: true,
    children: [ {
      title   : 'parent 1-0',
      key     : '1001',
      expanded: true,
      children: [
        { title: 'leaf', key: '10010', isLeaf: true },
        { title: 'leaf', key: '10011', isLeaf: true },
        { title: 'leaf', key: '10012', isLeaf: true }
      ]
    }, {
      title   : 'parent 1-1',
      key     : '1002',
      children: [
        { title: 'leaf', key: '10020', isLeaf: true }
      ]
    }, {
      title   : 'parent 1-2',
      key     : '1003',
      children: [
        { title: 'leaf', key: '10030', isLeaf: true },
        { title: 'leaf', key: '10031', isLeaf: true }
      ]
    } ]
  } ];
  constructor(
    private rememberService: RememberService,
    private toolService: ToolService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private articleService: FileService,
  ) {}
  ngOnInit() {
    setTimeout(() => {
      this.initHeight();
    }, 0);
    this.auth();
  }
  private initHeight() {
    this.scrollHeight.y = (window.document.body.clientHeight - 290) + 'px';
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('file');
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

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }


  private getData() {

  }
  refresh() {
    this.getData();
  }
  pageChanged(e) {
    this.pageIndex = e;
    this.getData();
  }
}
