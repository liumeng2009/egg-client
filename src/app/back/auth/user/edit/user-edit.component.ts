import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {EduConfig} from '../../../../config/config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../bean/user';
import {Role} from '../../../../bean/role';
import {Avatar} from '../../../../bean/avatar';
import {ConstomValidators} from '../../../../util/validators';
import {ResponseData} from '../../../../bean/responseData';
import {RoleService} from '../../role/role.service';
import {UserService} from '../user.service';
import {ToolService} from '../../../../util/tool.service';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {RememberService} from '../../../main/remember.service';

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {
  validateForm: FormGroup;
  user: User = new User(null, null, null, null, null, null, null, null, null, null, false);
  isLoading = false;
  isSubmitLoading = false;
  showEditBtn = false;
  roles: Role[] = [];
  roleList = true;
  roleListError = '';
  isLoadingRoleList = false;
  avatars: Avatar[] = [];
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
    private rememberService: RememberService,
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      mobile: [ '', [ Validators.required, ConstomValidators.phoneValidator()] ],
      realname: [ '' ],
      password: [ '123456', [ Validators.required ] ],
      age: [1],
      isAdmin: [false, [ Validators.required ] ],
      roleId: ['', [ Validators.required ] ]
    });
    this.validateForm.get('mobile').disable();
    this.auth();
    this.initRoleList();
    this.initAvatarList();
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
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
        && auth.auth_opInFunc.auth_operate.code === 'edit') {
        this.showEditBtn = true;
      }
    }
  }
  private initRoleList() {
    this.isLoadingRoleList = true;
    this.roleService.getRoleList(0, 0, '')
      .subscribe(
        (data: ResponseData) => {
          this.isLoadingRoleList = false;
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
          this.isLoadingRoleList = false;
        }
      );
  }
  private initAvatarList() {
    this.userService.getAvatarList()
      .subscribe(
        (data: ResponseData) => {
          console.log(data);
          this.toolService.apiResult(data, true).then(
            (result: ResponseData) => {

              this.avatars = [...result.data];
              this.avaTabSelectedIndex = 1;
          }).catch(() => {});
        },
        error => {
          console.log(error);
        }
      );
  }
  private getData(id: string) {
    this.isLoading = true;
    this.userService.show(id).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, false).then(
          (result: ResponseData) => {
            this.user = {...result.data};
            this.validateForm.setValue({
              mobile: this.user.mobile,
              realname: this.user.realname,
              password: this.user.password,
              age: this.user.age,
              isAdmin: this.user.isAdmin,
              roleId: this.user.roleId,
            });
            if (this.user.avatarUseSys === 0) {
              this.avaTabSelectedIndex = 0;
            }
        }).catch(() => {});
      },
      error => {
        this.isLoading = false;
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
      console.log(info);
      /*      this.getBase64(info.file.originFileObj, (img: string) => {
              this.loading = false;
              this.avatarUrl = img;
            });*/
      this.user.avatarUseSys = 0;
      this.user.avatar = info.file.response.data.path;
    }
  }
  submitForm() {
    this.isSubmitLoading = true
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
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
      this.userService.update(this.user).subscribe(
        (data: ResponseData) => {
          this.isSubmitLoading = false;
          this.toolService.apiResult(data, false).then(
            (result: ResponseData) => {
              this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).catch(() => {});
        },
        error => {
          this.isSubmitLoading = false;
        }
      );
    }
  }
  refresh() {
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }
  returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
