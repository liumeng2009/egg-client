import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import {AuthGuard} from '../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [AuthGuard],
    data: {name: '用户权限管理'},
    children: [
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
      },
      {
        path: 'role',
        loadChildren: './role/role.module#RoleModule',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
