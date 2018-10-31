import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role.component';
import {RoleListComponent} from './list/role-list.component';
import {RoleEditComponent} from './edit/role-edit.component';
import {RoleAddComponent} from './add/role-add.component';
import {TokenGuard} from '../../main/tokenGuard.service';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    canActivate: [TokenGuard, AuthGuard],
    data: {name: '角色管理'},
    children: [
      {
        path: 'list',
        component: RoleListComponent,
        canActivate: [TokenGuard, AuthGuard],
        data: {name: '列表'},
      },
      {
        path: 'add',
        component: RoleAddComponent,
        canActivate: [TokenGuard, AuthGuard],
        data: {name: '新增'},
      },
      {
        path: ':id',
        component: RoleEditComponent,
        canActivate: [TokenGuard, AuthGuard],
        data: {name: '编辑'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
