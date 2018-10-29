import { NgModule } from '@angular/core';
import { RoleComponent } from './role.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {RoleRoutingModule} from './role-routing.module';
import {RoleListComponent} from './list/role-list.component';
import {RoleAddComponent} from './add/role-add.component';
import {RoleEditComponent} from './edit/role-edit.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    RoleComponent,
    RoleListComponent,
    RoleAddComponent,
    RoleEditComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    RoleRoutingModule,
  ],
  bootstrap: [RoleComponent]
})
export class RoleModule { }
