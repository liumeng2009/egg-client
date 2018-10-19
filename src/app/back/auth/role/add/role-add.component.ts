import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {RoleService} from '../role.service';
import {Role} from '../../../../bean/role';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponseData} from '../../../../bean/responseData';
import {ToolService} from '../../../../util/tool.service';

@Component({
  selector: 'app-role-add-page',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})

export class RoleAddComponent implements OnInit {
  validateForm: FormGroup;
  role: Role;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toolService: ToolService,
  ) {}


  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [ '', [ Validators.required ] ],
      remark: [ '' ],
    });

  }

  private submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isLoading = true;
      const name = this.validateForm.get('name').value;
      const remark = this.validateForm.get('remark').value;
      this.role = new Role(null, name, remark, null);
      this.roleService.create(this.role).subscribe(
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
