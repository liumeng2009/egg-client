import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import {TotalComponent} from '../total/total.component';
import {TokenGuard} from './tokenGuard.service';
import {AuthComponent} from '../auth/auth.component';
import {AuthGuard} from './authGuard.service';
import {UserComponent} from '../auth/user/user.component';
import {UserListComponent} from '../auth/user/list/user-list.component';
import {UserAddComponent} from '../auth/user/add/user-add.component';
import {UserEditComponent} from '../auth/user/edit/user-edit.component';
import {RoleComponent} from '../auth/role/role.component';
import {RoleListComponent} from '../auth/role/list/role-list.component';
import {RoleAddComponent} from '../auth/role/add/role-add.component';
import {RoleEditComponent} from '../auth/role/edit/role-edit.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'total',
        loadChildren: '../total/total.module#TotalModule',
        data: {name: '网站信息'},
      },
      {
        path: 'auth',
        loadChildren: '../auth/auth.module#AuthModule',
        data: {name: '用户权限管理'},
      }
    ]
  },
/*  {

/!*    children: [
      {path: 'total', component: TotalComponent, canActivate: [TokenGuard], data: {name: '网站信息', icon: 'appstore'}},
      {path: 'auth', component: AuthComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '用户权限管理', icon: 'user'}, children: [
          { path: 'user', component: UserComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '用户管理'}, children: [
              {path: 'list', component: UserListComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '列表'}},
              {path: 'add', component: UserAddComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '新增'}},
              {path: ':id', component: UserEditComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '编辑'}}
            ]},
          { path: 'role', component: RoleComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '角色管理'}, children: [
              {path: 'list', component: RoleListComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '列表'}},
              {path: 'add', component: RoleAddComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '新增'}},
              {path: ':id', component: RoleEditComponent, canActivate: [TokenGuard, AuthGuard], data: {name: '编辑'}}
            ]},
        ]}
    ]*!/
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
