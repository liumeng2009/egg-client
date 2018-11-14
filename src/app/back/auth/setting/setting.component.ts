import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ResponseData} from '../../../bean/responseData';
import {ToolService} from '../../../util/tool.service';
import {NzMessageService, NzModalService, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {ConstomValidators} from '../../../util/validators';
import {User} from '../../../bean/user';
import {UserService} from '../user/user.service';
import {Avatar} from '../../../bean/avatar';
import {EduConfig} from '../../../config/config';
import {HttpEvent, HttpResponse} from '@angular/common/http';
import {PasswordComponent} from './password.component';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit {
  validateForm: FormGroup;
  formHeight = {
    height : '0px'
  }
  user: User = new User(null, null, null, null, null, null, null, null, null, null, false);
  isLoading = false;
  isSubmitLoading = false;
  saveBtn = false;
  avatars: Avatar[] = [];
  serverPath = EduConfig.serverPath;
  uploadPath = this.serverPath + '/api/upload';
  avaTabSelectedIndex = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toolService: ToolService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
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
    this.initHeight();
    this.getData();
    this.initAvatarList();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69 )) + 'px';
  }
  private getData() {
    this.isLoading = true;
    this.userService.showOwn().subscribe(
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
              // this.avaTabSelectedIndex = 0;
            }
          }).catch(() => {});
      },
      error => {
        this.isLoading = false;
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
  setSysAvatar(_avatar_path) {
    this.user.avatarUseSys = 1;
    this.user.avatar = _avatar_path;
  }
  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this.messageService.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.messageService.error('Image must smaller than 2MB!');
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
      this.user.avatar = info.file.response.location;
    }
  }
  customReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    formData.append('file', item.file as any);
    // const token = this.cookieService.get('eduToken');
    // const headers = new HttpHeaders({'authorization': token ? token : ''});
    // const req = new HttpRequest('POST', item.action, formData, {headers: headers});
    return this.toolService.upload(item.action, formData).subscribe((event: HttpEvent<{}>) => {
      if (event instanceof HttpResponse) {
        // 处理成功
        item.onSuccess(event.body, item.file, event);
      }
    }, (err) => {
      // 处理失败
      item.onError(err, item.file);
    });
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
              // this.router.navigate(['list'], {relativeTo: this.route.parent});
            }
          ).catch(() => {});
        },
        error => {
          this.isSubmitLoading = false;
        }
      );
    }
  }
  showChangePasswordModal() {
    const modal = this.modalService.create({
      nzTitle: '修改密码',
      nzContent: PasswordComponent,
      nzFooter: [{
        label: '修改',
        type: 'primary',
        show: true,
        loading:  (contentComponentInstance) => {
          return contentComponentInstance.isSubmitLoading;
        },
        onClick: (componentInstance) => {
          // componentInstance.title = 'title in inner component is changed';
          componentInstance.submitForm();
        }
      }]
    });
  }
  refresh() {
    this.getData();
  }
  returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
