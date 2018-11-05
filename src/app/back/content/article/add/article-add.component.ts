import {Component, OnInit} from '@angular/core';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Channel} from '../../../../bean/Channel';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ResponseData} from '../../../../bean/responseData';
import {RoleService} from '../../../auth/role/role.service';
import {UserService} from '../../../auth/user/user.service';
import {ToolService} from '../../../../util/tool.service';
import {NzMessageService} from 'ng-zorro-antd';
import {CookieService} from 'ngx-cookie';
import {HttpClient} from '@angular/common/http';
import {RememberService} from '../../../main/remember.service';
import {CategoryService} from '../../category/category.service';

@Component({
  selector: 'app-article-add-page',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.scss'],
})

export class ArticleAddComponent implements OnInit {
  category: ArticleCategory[] = [];
  validateForm: FormGroup;
  isLoading = false;
  categories: ArticleCategory[] = [];
  categoryList = false;
  categoryListError = '';
  isLoadingCategoryList = false;
  channel: Channel;
  channelList = false;
  channelListError = '';
  isLoadingchannel = false;
  formHeight = {
    height : '0px'
  }
  saveBtn = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private userService: UserService,
    private toolService: ToolService,
    private message: NzMessageService,
    private cookieService: CookieService,
    private http: HttpClient,
    private rememberService: RememberService,
    private categoryService: CategoryService,
  ) {}
  ngOnInit() {
    this.validateForm = this.fb.group({
      categoryId: [ null , [ Validators.required ] ],
      title: [ '', [ Validators.required ]],
      imgUrl: [ '' ],
      sort: [ 100 ],
      click: [ 0 ],
      publishAt: [ null ],
    });
    this.initCategoryList();
    this.initHeight();
    this.auth();
    this.initChannel();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69)) + 'px';
  }
  private auth() {
    const user = this.rememberService.getUser();
    if (user) {
      const authArray = this.initAuth('user');
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
        this.saveBtn = true;
      }
    }
  }

  private initChannel() {
    this.isLoadingchannel = true;
    this.route.params.subscribe((params: Params) => {
      const channelId = params.channelId;
      this.categoryService.showChannel(channelId).subscribe(
        (data: ResponseData) => {
          this.isLoadingchannel = false;
          this.toolService.apiResult(data, true).then(
            (result: ResponseData) => {
              this.channel = {...result.data};
              console.log(this.channel);
              this.channelList = true;
            }).catch((error) => {
            this.channelListError = error;
          });
        },
        error => {
          this.isLoadingchannel = false;
          this.channelListError = error;
        }
      );
    });
  }

  initCategoryList() {
    this.isLoadingCategoryList = true;
    this.route.params.subscribe((params: Params) => {
      const channelId = params.channelId;
      console.log(params);
      this.categoryService.getCategoryList(channelId).subscribe(
        (data: ResponseData) => {
          this.isLoadingCategoryList = false;
          this.toolService.apiResult(data, true).then(
            (result: ResponseData) => {
              this.categories = [...result.data];
              this.categoryList = true;
            }
          ).catch((error) => {
            this.categoryList = false;
            this.categoryListError = error;
          });
        },
        error => {
          this.isLoadingCategoryList = false;
          this.categoryList = false;
          this.categoryListError = error;
        }
      );
    });
  }
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
    }
  }
  returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
