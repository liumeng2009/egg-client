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

@Component({
  selector: 'app-user-edit-page',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {
  validateForm: FormGroup;
  user: User = new User(null, null, null, null, null, null, null, null);
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
  ) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      mobile: [ '', [ Validators.required, ConstomValidators.phoneValidator()] ],
      realname: [ '' ],
      password: [ '123456', [ Validators.required ] ],
      age: [1],
      roleId: ['', [ Validators.required ] ]
    });
    this.validateForm.get('mobile').disable();
    this.initHeight();
    this.initRoleList();
    this.initAvatarList();
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
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
  private getData(id: string) {
    this.isLoading = true;
    this.userService.show(id).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        const result = this.toolService.apiResult(data);
        if (result) {
          this.user = {...result.data};
          this.validateForm.setValue({
            mobile: this.user.mobile,
            realname: this.user.realname,
            password: this.user.password,
            age: this.user.age,
            roleId: this.user.roleId,
          });
          if (this.user.avatarUseSys === 0) {
            this.avaTabSelectedIndex = 0;
          }
        }
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
      this.userService.update(this.user).subscribe(
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
  private refresh() {
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }
}
