import {Component, OnInit} from '@angular/core';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../category.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {RememberService} from '../../../../util/remember.service';
import {EN} from '../../../../config/en';
import {ZH} from '../../../../config/zh';

@Component({
  selector: 'app-article-category-edit-page',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss'],
})

export class CategoryEditComponent implements OnInit {
  category: ArticleCategory = new ArticleCategory(null, null, null,
    null, null, null, null, null, null, true);
  validateForm: FormGroup;
  isLoading = false;
  categories: ArticleCategory[] = [];
  categoryList = false;
  categoryListError = '';
  isLoadingCategoryList = false;
  formHeight = {
    height : '0px'
  }
  saveBtn = true;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toolService: ToolService,
    private rememberService: RememberService,
  ) {}

  ngOnInit() {
    this.initHeight();
    this.route.params.subscribe((params) => {
      const categoryId = params.id;
      this.getData(categoryId);
    });
    this.validateForm = this.fb.group({
      channelId: [null],
      parentId: [ null , [ Validators.required ] ],
      name: [ '', [ Validators.required ]],
      code: [''],
      sort: [''],
    });
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69)) + 'px';
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
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.saveBtn = true;
      }
    }
  }
  getData(categoryId) {
    this.isLoading = true;
    this.categoryService.getCategory(categoryId).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, false).then((result: ResponseData) => {
          this.category = {...result.data};
          this.validateForm.setValue({
            channelId: this.category.channelId,
            parentId: this.category.parentId,
            name: this.category.name,
            code: this.category.code,
            sort: this.category.sort,
          });
          this.initCategoryList(this.category.channelId);
        }).catch(() => {});
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  initCategoryList(channelId) {
    this.isLoadingCategoryList = true;
    this.categoryService.getCategoryList(channelId).subscribe(
      (data: ResponseData) => {
        this.isLoadingCategoryList = false;
        this.toolService.apiResult(data, true).then(
          (result: ResponseData) => {
            this.categories = [...result.data];
            this.categoryList = true;
            const categoryTop = new ArticleCategory(0, this.rememberService.getLang() === 'en' ? EN.AllCategories : ZH.AllCategories,
              '', channelId, null,
              0, '', -1, 0, false);
            this.categories.unshift(categoryTop);
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
      this.category.level = level;
      this.category.sort = sort;
      this.categoryService.create(this.category).subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              console.log(result);
              this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).catch(() => {});
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
  refresh() {
    this.route.params.subscribe((params) => {
      const categoryId = params.id;
      this.getData(categoryId);
    });
  }
  returnToList(e) {
    e.stopPropagation();
    this.route.params.subscribe((params) => {
      this.router.navigate(['list'], {relativeTo: this.route.parent});
    });
  }
}
