import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../bean/user';
import {ResponseData} from '../../../../bean/responseData';
import {RoleService} from '../../role/role.service';
import {ToolService} from '../../../../util/tool.service';
import {Role} from '../../../../bean/role';
import {UserService} from '../user.service';
import {Avatar} from '../../../../bean/avatar';
import {EduConfig} from '../../../../config/config';
import {NzMessageService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {ConstomValidators} from '../../../../util/validators';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {CookieService} from 'angular2-cookie/core';


@Component({
  selector: 'app-user-add-page',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})

export class UserAddComponent implements OnInit {
  validateForm: FormGroup;
  user: User = new User(null, null, null, null, null, null, null, null, null);
  isLoading = false;
  roles: Role[] = [];
  avatars: Avatar[] = [];
  formHeight = {
    height : '0px'
  }
  serverPath = new EduConfig().serverPath;
  uploadPath = this.serverPath + '/api/upload';
  avaTabSelectedIndex = 0;
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
  ) {}


  ngOnInit() {
    this.validateForm = this.fb.group({
      mobile: [ '', [ Validators.required, ConstomValidators.phoneValidator() ] ],
      realname: [ '' ],
      password: [ '123456', [ Validators.required ] ],
      age: [1],
      roleId: ['', [ Validators.required ] ]
    });
    this.initHeight();
    this.initRoleList();
    this.initAvatarList();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69 )) + 'px';
  }
  private initRoleList() {
    this.roleService.getRoleList(0, 0, '')
      .subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
            this.roles = [...result.data.rows];
            if (this.roles.length > 0) {
              this.validateForm.patchValue({roleId: this.roles[0].id});
            }

          }
        },
        error => {

        }
      );
  }
  private initAvatarList() {
    this.userService.getAvatarList()
      .subscribe(
        (data: ResponseData) => {
          const result = this.toolService.apiResult(data);
          if (result) {
            this.avatars = [...result.data];
            this.avaTabSelectedIndex = 1;
          }
        },
        error => {

        }
      );
  }

  setSysAvatar(_avatar_path) {
    this.user.avatarUseSys = 1;
    this.user.avatar = _avatar_path;
  }
  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this.message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }
  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if (info.file.response.code === 0) {
        this.user.avatarUseSys = 0;
        this.user.avatar = info.file.response.data.path;
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

  private submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      const mobile = this.validateForm.get('mobile').value;
      const realname = this.validateForm.get('realname').value;
      const password = this.validateForm.get('password').value;
      const age = this.validateForm.get('age').value;
      const roleId = this.validateForm.get('roleId').value;
      this.user.mobile = mobile;
      this.user.realname = realname;
      this.user.password = password;
      this.user.age = age;
      this.user.roleId = roleId;
      console.log(this.user);
      this.userService.create(this.user).subscribe(
        (data: ResponseData) => {
          this.isLoading = false;
          const result = this.toolService.apiResult(data);
          if (result) {
            this.router.navigate(['list'], {relativeTo: this.route.parent});
          }
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
}
