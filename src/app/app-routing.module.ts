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

const routes: Routes = [
  {path: '', redirectTo: '/admin', pathMatch: 'full', data: {name: '首页'}},
  {path: 'login', component: LoginComponent , data: {name: '登录'}},
  {path: 'admin', component: MainComponent, data: {name: '首页'}, canActivate: [TokenGuard], children: [
      {path: 'total', component: TotalComponent, canActivate: [TokenGuard], data: {name: '网站信息', icon: 'appstore'}},
      {path: 'auth', component: AuthComponent, canActivate: [TokenGuard], data: {name: '用户权限管理', icon: 'user'}, children: [
          { path: 'user', component: UserComponent, canActivate: [TokenGuard], data: {name: '用户管理'}, children: [
              {path: 'list', component: UserListComponent, canActivate: [TokenGuard], data: {name: '列表'}},
              {path: 'add', component: UserAddComponent, canActivate: [TokenGuard], data: {name: '新增'}},
              {path: ':id', component: UserEditComponent, canActivate: [TokenGuard], data: {name: '编辑'}}
          ]},
      ]}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
