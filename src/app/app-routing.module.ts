import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './back/login/login.component';
import {MainComponent} from './back/main/main.component';
import {TokenGuard} from './back/main/tokenGuard.service';
import {AuthComponent} from './back/auth/auth.component';
import {UserComponent} from './back/auth/user/user.component';
import {UserListComponent} from './back/auth/user/list/user-list.component';
import {UserAddComponent} from './back/auth/user/add/user-add.component';
import {UserEditComponent} from './back/auth/user/edit/user-edit.component';
import {TotalComponent} from './back/total/total.component';
import {OtherComponent} from './back/myComponents/noFound/other.component';
import {RoleComponent} from './back/auth/role/role.component';
import {RoleEditComponent} from './back/auth/role/edit/role-edit.component';
import {RoleAddComponent} from './back/auth/role/add/role-add.component';
import {RoleListComponent} from './back/auth/role/list/role-list.component';
import {AuthGuard} from './back/main/authGuard.service';
import {NoAuthComponent} from './back/myComponents/noAuth/noAuth.component';

const routes: Routes = [
  {path: '', redirectTo: '/admin/total', pathMatch: 'full', data: {name: '首页'}},
  {path: 'login', component: LoginComponent , data: {name: '登录'}},
  {path: 'admin', component: MainComponent, data: {name: '首页'}, canActivate: [TokenGuard], children: [
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
  ]},
  {path: 'noauth', component: NoAuthComponent, data: {name: '没有权限访问该页面'}},
  {path: '**', component: OtherComponent, data: {name: '页面未找到'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
