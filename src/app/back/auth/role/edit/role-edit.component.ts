import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {RoleService} from '../role.service';
import {Role} from '../../../../bean/role';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponseData} from '../../../../bean/responseData';
import {ToolService} from '../../../../util/tool.service';

@Component({
  selector: 'app-role-edit-page',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit {
  validateForm: FormGroup;
  role: Role;
  @ViewChild('cardHeaderTemplate') cardHeaderTemplate: ElementRef;
  isLoading = false;
  isSubmitLoading = false;
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
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }

  private getData(id: string) {
    this.isLoading = true;
    this.roleService.show(id).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        const result = this.toolService.apiResult(data);
        if (result) {
          this.role = {...result.data};
/*          this.validateForm = this.fb.group({
            name: [ this.role.name, [ Validators.required ] ],
            remark: [ this.role.remark ],
          });*/
          this.validateForm.setValue({name: this.role.name, remark: this.role.remark});
        }
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  private refresh() {
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }
  private submitForm() {
    console.log('submit');
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this.isSubmitLoading = true;
      this.role.name = this.validateForm.get('name').value;
      this.role.remark = this.validateForm.get('remark').value;
      this.roleService.update(this.role).subscribe(
        (data: ResponseData) => {
          this.isSubmitLoading = false;
          const result = this.toolService.apiResult(data);
          if (result) {
            this.router.navigate(['list'], {relativeTo: this.route.parent});
          }
        },
        error => {
          this.isSubmitLoading = false;
        }
      );
    }
  }
  private returnToList(e) {
    e.stopPropagation();
    this.router.navigate(['list'], {relativeTo: this.route.parent});
  }
}
