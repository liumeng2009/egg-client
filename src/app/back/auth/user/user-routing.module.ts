import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import {UserListComponent} from './list/user-list.component';
import {UserEditComponent} from './edit/user-edit.component';
import {UserAddComponent} from './add/user-add.component';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [ AuthGuard],
    data: {name: '用户管理', name_en: 'User'},
    children: [
      {
        path: 'list',
        component: UserListComponent,
        canActivate: [ AuthGuard],
        data: {name: '列表', name_en: 'List'},
      },
      {
        path: 'add',
        component: UserAddComponent,
        canActivate: [ AuthGuard],
        data: {name: '新增', name_en: 'Add'},
      },
      {
        path: ':id',
        component: UserEditComponent,
        canActivate: [ AuthGuard],
        data: {name: '编辑', name_en: 'Edit'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
