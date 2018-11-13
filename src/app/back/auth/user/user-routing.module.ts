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
    data: {name: '用户管理'},
    children: [
      {
        path: 'list',
        component: UserListComponent,
        canActivate: [ AuthGuard],
        data: {name: '列表'},
      },
      {
        path: 'add',
        component: UserAddComponent,
        canActivate: [ AuthGuard],
        data: {name: '新增'},
      },
      {
        path: ':id',
        component: UserEditComponent,
        canActivate: [ AuthGuard],
        data: {name: '编辑'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
