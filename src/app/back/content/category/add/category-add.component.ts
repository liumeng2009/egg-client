import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RoleService} from '../../../auth/role/role.service';
import {UserService} from '../../../auth/user/user.service';
import {ToolService} from '../../../../util/tool.service';
import {NzMessageService} from 'ng-zorro-antd';
import {CookieService} from 'ngx-cookie';
import {HttpClient} from '@angular/common/http';
import {RememberService} from '../../../../util/remember.service';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {CategoryService} from '../category.service';
import {ResponseData} from '../../../../bean/responseData';
import {Channel} from '../../../../bean/Channel';

@Component({
  selector: 'app-article-category-add-page',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss'],
})

export class CategoryAddComponent implements OnInit {
  category: ArticleCategory = new ArticleCategory(null, null, null,
    null, null, null, null, null, null, 1, true);
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
    this.route.params.subscribe( (params: Params) => {
      const parentId = params.parentId;
      this.validateForm = this.fb.group({
        parentId: [ parseInt(parentId, 10) , [ Validators.required ] ],
        name: [ '', [ Validators.required ]],
        code: [ '', [ Validators.required ] ],
        sort: [ 100 ],
      });
      this.initCategoryList();
    })

    this.initHeight();
    this.auth();
    this.initChannel();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69 )) + 'px';
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
              const categoryTop = new ArticleCategory(0, '无父级分类', '', channelId, null,
                0, '', -1, 0, 1, false);
              this.categories.unshift(categoryTop);
              console.log(this.categories);
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
      const parentId = this.validateForm.get('parentId').value;
      const name = this.validateForm.get('name').value;
      const code = this.validateForm.get('code').value;
      const sort = this.validateForm.get('sort').value;
      let level = 0;
      this.category.parentId = parentId;
      this.category.name = name;
      this.category.code = code;
      for (const cate of this.categories) {
        if (cate.id === parentId) {
          level = cate.level + 1;
        }
      }
      this.category.channelId = this.channel.id;
      this.category.level = level;
      this.category.sort = sort;
      this.categoryService.create(this.category).subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              console.log(result);
              // this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).catch(() => {});
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
  returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
