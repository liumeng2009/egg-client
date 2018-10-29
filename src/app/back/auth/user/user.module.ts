import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {UserListComponent} from './list/user-list.component';
import {UserAddComponent} from './add/user-add.component';
import {UserEditComponent} from './edit/user-edit.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    UserRoutingModule,
  ],
  bootstrap: [UserComponent]
})
export class UserModule { }
