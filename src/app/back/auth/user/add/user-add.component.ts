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


@Component({
  selector: 'app-user-add-page',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})

export class UserAddComponent implements OnInit {
  validateForm: FormGroup;
  user: User = new User(null, null, null, null, null, null, null, null);
  isLoading = false;
  roles: Role[] = [];
  avatars: Avatar[] = [];
  formHeight = {
    height : '0px'
  }
  serverPath = new EduConfig().serverPath;
  avaTabSelectedIndex = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
    private userService: UserService,
    private toolService: ToolService,
  ) {}


  ngOnInit() {
    this.validateForm = this.fb.group({
      mobile: [ '', [ Validators.required ] ],
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
    alert(_avatar_path);
    this.user.avatarUseSys = 1;
    this.user.avatar = _avatar_path;
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
    }
  }
}
