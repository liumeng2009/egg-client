import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';


const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule',
        data: {name: '用户管理'},
      },
      {
        path: 'role',
        loadChildren: './role/role.module#RoleModule',
        data: {name: '角色管理'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
