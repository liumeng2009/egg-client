import {Component, OnInit} from '@angular/core';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Channel} from '../../../../bean/Channel';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ResponseData} from '../../../../bean/responseData';
import {RoleService} from '../../../auth/role/role.service';
import {UserService} from '../../../auth/user/user.service';
import {ToolService} from '../../../../util/tool.service';
import {NzMessageService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {CookieService} from 'ngx-cookie';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {RememberService} from '../../../../util/remember.service';
import {CategoryService} from '../../category/category.service';
import {Article} from '../../../../bean/Article';
import {User} from '../../../../bean/user';
import {ArticleService} from '../article.service';
import {EduConfig} from '../../../../config/config';
import * as moment from 'moment';
import {ArticleAlbum} from '../../../../bean/ArticleAlbum';

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
  channelId = 0;
  channel: Channel;
  channelList = false;
  channelListError = '';
  isLoadingchannel = false;
  formHeight = {
    height : '0px'
  };
  article: Article = new Article(null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, [], null,
    );
  canAuditing = false;
  saveBtn = false;
  user: User;
  serverPath = EduConfig.serverPath;
  uploadPath = this.serverPath + '/api/upload';
  fileList = [];
  multipleFileList = [];
  previewImage = '';
  previewMultiImage = '';
  previewVisible = false;
  previewMultiVisible = false;
  tinyMceInitOption = EduConfig.tinyMceOptions;
  tinyMceInitOptionEn = EduConfig.tinyMceOptions;
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
    this.initLang();
    this.auth();
    this.tinyMceInitOption.images_upload_handler = this.tinyImageUploadHander;
    this.validateForm = this.fb.group({
      categoryId: [ null , [ Validators.required ] ],
      title: [''],
      code: [null],
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
    this.initCategoryList();
    this.initChannel();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69)) + 'px';
  }
  initLang() {
    const pathname = location.pathname;
    if (pathname.indexOf('/zh/') > -1) {
      this.tinyMceInitOption.language = 'zh-CN';
    } else if (pathname.indexOf('/en/') > -1) {
      this.tinyMceInitOption.language = '';
    } else {
      this.tinyMceInitOption.language = 'zh-CN';
    }
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

  private initChannel() {
    this.isLoadingchannel = true;
    this.route.params.subscribe((params: Params) => {
      this.rememberService.setChannel(parseInt(params.channelId, 10));
      this.channelId = params.channelId;
      this.categoryService.showChannel(this.channelId).subscribe(
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
      this.channelId = params.channelId;
      console.log(params);
      this.categoryService.getCategoryList(this.channelId).subscribe(
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
      if (info.file.response.location) {
        // this.user.avatarUseSys = 0;
        // this.user.avatar = info.file.response.data.path;
        if (this.fileList.length > 1) {
          this.fileList.splice(0, 1);
        }
        this.article.imgUrl = info.file.response.location;
        console.log(info.file.response.location);
      } else {
        this.message.error('上传出现错误');
      }

    }
  }
  handleMultiChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if (info.file.response.location) {
        // this.user.avatarUseSys = 0;
        // this.user.avatar = info.file.response.data.path;
        console.log(info.file.response.location);
        // 将返回的图片路径，存入article的album属性中
        const album = new ArticleAlbum(null, null, info.file.response.location, null, null, null);
        this.article.article_albums.push(album);
      } else {
        this.message.error('上传出现错误');
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

  tinyImageUploadHander = (blobInfo, success, failure) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', blobInfo.blob());
    const token = this.cookieService.get('eduToken');
    const headers = new HttpHeaders({'responseType' : 'text', 'authorization': token ? token : ''});
    const req = new HttpRequest('POST', EduConfig.tinyMceOptions.images_upload_url, formData, {headers: headers});
    return this.http.request(req).subscribe((event: HttpEvent<{}>) => {
      if (event instanceof HttpResponse) {
        // 处理成功
        // success(EduConfig.serverPath + event.body);
        // success('http://127.0.0.1:7001/123.jpg');
        // 没办法了，拼字符串, 由于不知道怎么处理typescript，所以取不出body中的location字段
        const str = JSON.stringify(event.body);
        let resultUrl = str.substring(0, str.length - 2);
        resultUrl = resultUrl.replace('{"location":"', '');
        success(EduConfig.serverPath + resultUrl);
      }
    }, (err) => {
      // 处理失败
      failure(err);
    });

  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  handleMultiPreview =  (file: UploadFile) => {
    this.previewMultiImage = file.url || file.thumbUrl;
    this.previewMultiVisible = true;
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
      this.article.code = (this.validateForm.get('code').value === null || this.validateForm.get('code').value.trim() === '')
        ? null : this.validateForm.get('code').value;
      this.article.sort = this.validateForm.get('sort').value;
      this.article.click = this.validateForm.get('click').value;
      this.article.zhaiyao = this.validateForm.get('zhaiyao').value;
      this.article.content = this.validateForm.get('content').value;
      this.article.isComment = this.validateForm.get('isComment').value;
      this.article.isTop = this.validateForm.get('isTop').value;
      this.article.isRed = this.validateForm.get('isRed').value;
      this.article.isHot = this.validateForm.get('isHot').value;
      this.article.isSlide = this.validateForm.get('isSlide').value;
      this.article.publishAt = moment(this.validateForm.get('publishAt').value).isValid()
        ? moment(this.validateForm.get('publishAt').value).format('YYYY-MM-DD HH:mm:ss')
        : null;
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
