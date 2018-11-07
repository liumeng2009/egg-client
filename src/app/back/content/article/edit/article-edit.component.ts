import {Component, OnInit} from '@angular/core';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Channel} from '../../../../bean/Channel';
import {Article} from '../../../../bean/Article';
import {User} from '../../../../bean/user';
import {EduConfig} from '../../../../config/config';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RoleService} from '../../../auth/role/role.service';
import {UserService} from '../../../auth/user/user.service';
import {ToolService} from '../../../../util/tool.service';
import {NzMessageService, UploadFile, UploadFileStatus, UploadXHRArgs} from 'ng-zorro-antd';
import {CookieService} from 'ngx-cookie';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {RememberService} from '../../../main/remember.service';
import {CategoryService} from '../../category/category.service';
import {ArticleService} from '../article.service';
import {ResponseData} from '../../../../bean/responseData';
import * as moment from 'moment';

@Component({
  selector: 'app-article-edit-page',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss'],
})

export class ArticleEditComponent implements OnInit {
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
  article: Article = new Article(null, null, null, null, null, null, null,
    null, null, null, null, null, null, null,
    null, null, null, null,
  );
  canAuditing = false;
  saveBtn = false;
  user: User;
  serverPath = new EduConfig().serverPath;
  uploadPath = this.serverPath + '/api/upload';
  fileList = [

  ];
  fileListShow;
  previewImage = '';
  previewVisible = false;
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
    private articleService: ArticleService,
  ) {}
  ngOnInit() {
    this.initHeight();
    this.auth();
    this.validateForm = this.fb.group({
      channelId: [ null , [ Validators.required ] ],
      categoryId: [ null , [ Validators.required ] ],
      title: [ '', [ Validators.required ]],
      imgUrl: [ '' ],
      zhaiyao: [''],
      content: [''],
      status: [ this.canAuditing ? 1 : 0 ],
      sort: [ 100 ],
      click: [ 0 ],
      isComment: [true],
      isTop:  [false],
      isRed:  [false],
      isHot:  [false],
      isSlide:  [false],
      author: [null],
      auditing: [null],
      publishAt: [ null ],
    });
    this.route.params.subscribe((params) => {
      this.getData(params.id);
    });
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69)) + 'px';
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
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.saveBtn = true;
      }
      if (auth.auth_opInFunc
        && auth.auth_opInFunc.auth_operate
        && auth.auth_opInFunc.auth_operate.code
        && auth.auth_opInFunc.auth_operate.code === 'auditing') {
        this.canAuditing = true;
      }
    }
  }

  private initChannel(channelId) {
    this.isLoadingchannel = true;
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
  getData(id: number) {
    this.articleService.getArticle(id).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, false).then(
          (result: ResponseData) => {
            this.article = {...result.data};
            console.log(this.article);
            if (this.article.status === 2) {
              // 如果是未审核状态，则需要置为0 来正确的展示UI
              this.article.status = 0;
            }
            const status: UploadFileStatus = 'done';
            if (this.article.imgUrl) {
              const file =  {
                uid: '-1',
                name: this.article.imgUrl.substring(this.article.imgUrl.lastIndexOf('/') + 1, this.article.imgUrl.length),
                status: status,
                url: this.serverPath + this.article.imgUrl,
                size: 0,
                type: 'jpg',
              };
              const f: UploadFile = {...file};
              this.fileList.push(f);
              this.fileListShow = [...this.fileList];
              console.log(this.fileList);
            }
            this.validateForm.setValue({
              channelId: this.article.channelId,
              categoryId: this.article.categoryId,
              title:  this.article.title,
              imgUrl:  this.article.imgUrl,
              zhaiyao:  this.article.zhaiyao,
              content:  this.article.content,
              status:  this.article.status,
              sort:  this.article.sort,
              click:  this.article.click,
              isComment:  this.article.isComment,
              isTop:   this.article.isTop,
              isRed:   this.article.isRed,
              isHot:   this.article.isHot,
              isSlide:   this.article.isSlide,
              author:  this.article.author,
              auditing:  this.article.auditing,
              publishAt:  this.article.publishAt,
            });
            this.initChannel(this.article.channelId);
            this.initCategoryList(this.article.channelId);
          }).catch(() => {});
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isPNG && !isJPG) {
      this.message.error('请您上传一张格式为：JPG、PNG的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('文件大小需要小于 2MB!');
    }
    return (isJPG || isPNG) && isLt2M;
  }
  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if (info.file.response.code === 0) {
        // this.user.avatarUseSys = 0;
        // this.user.avatar = info.file.response.data.path;
        if (this.fileList.length > 1) {
          this.fileList.splice(0, 1);
        }
        this.article.imgUrl = info.file.response.data.path;
      } else {
        this.message.error(info.file.response.error);
      }

    }
  }
  customReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'authorization': token ? token : ''});
    const req = new HttpRequest('POST', item.action, formData, {headers: headers});
    return this.http.request(req).subscribe((event: HttpEvent<{}>) => {
      if (event instanceof HttpResponse) {
        // 处理成功
        item.onSuccess(event.body, item.file, event);
      }
    }, (err) => {
      // 处理失败
      item.onError(err, item.file);
    });
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.article.channelId = this.channel.id;
      this.article.categoryId = this.validateForm.get('categoryId').value;
      // 控件值是0 status赋值为2，代表未审核 控件值是1 status赋值为1，代表正常状态
      this.article.status = this.validateForm.get('status').value ? this.validateForm.get('status').value : 2;
      this.article.title = this.validateForm.get('title').value;
      this.article.sort = this.validateForm.get('sort').value;
      this.article.click = this.validateForm.get('click').value;
      this.article.zhaiyao = this.validateForm.get('zhaiyao').value;
      this.article.content = this.validateForm.get('content').value;
      this.article.isComment = this.validateForm.get('isComment').value;
      this.article.isTop = this.validateForm.get('isTop').value;
      this.article.isRed = this.validateForm.get('isRed').value;
      this.article.isHot = this.validateForm.get('isHot').value;
      this.article.isSlide = this.validateForm.get('isSlide').value;
      this.article.publishAt = moment(this.validateForm.get('publishAt').value).format('YYYY-MM-DD HH:mm:ss');
      this.user = this.rememberService.getUser();
      this.article.author = this.user.id;
      if (this.canAuditing && this.article.status === 1) {
        this.article.auditing = this.user.id;
      }
      console.log(this.article);
      this.articleService.create(this.article).subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          this.toolService.apiResult(data, false).then(() => {
            this.router.navigate(['list'], {relativeTo: this.route.parent});
          }).catch(() => {

          });
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
