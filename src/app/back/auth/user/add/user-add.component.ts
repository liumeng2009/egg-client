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
import {RememberService} from '../../../main/remember.service';
import {MissionService} from '../../../main/mission.service';


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
  roleList = true;
  roleListError = '';
  isLoadingRoleList = false;
  avatars: Avatar[] = [];
  formHeight = {
    height : '0px'
  }
  serverPath = new EduConfig().serverPath;
  uploadPath = this.serverPath + '/api/upload';
  avaTabSelectedIndex = 0;
  saveBtn = false;
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
  ) {}


  ngOnInit() {
    this.validateForm = this.fb.group({
      mobile: [ '', [ Validators.required, ConstomValidators.phoneValidator() ] ],
      realname: [ '' ],
      password: [ '123456', [ Validators.required ] ],
      age: [1],
      roleId: ['', [ Validators.required ] ]
    });
    this.auth();
    this.initHeight();
    this.initRoleList();
    this.initAvatarList();
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
      console.log(auths);
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

  private initRoleList() {
    this.isLoadingRoleList = true ;
    this.roleService.getRoleList(0, 0, '')
      .subscribe(
        (data: ResponseData) => {
          this.isLoadingRoleList = false ;
          this.toolService.apiResult(data, true).then(
            (result: ResponseData) => {
              this.roles = [...result.data.rows];
              if (this.roles.length > 0) {
                this.validateForm.patchValue({roleId: this.roles[0].id});
              }
            }
          ).catch((error) => {
            this.roleList = false;
            this.roleListError = error;
          });
        },
        error => {
          this.isLoadingRoleList = false ;
          this.roleListError = new EduConfig().ajaxError;
        }
      );
  }
  private initAvatarList() {
    this.userService.getAvatarList()
      .subscribe(
        (data: ResponseData) => {
          this.toolService.apiResult(data, true).then(
            (result: ResponseData) => {
              this.avatars = [...result.data];
              this.avaTabSelectedIndex = 1;
            }
          ).catch(() => {});
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
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).then(() => {});
        },
        error => {
          this.isLoading = false;
        }
      );
    }
  }
  private returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
