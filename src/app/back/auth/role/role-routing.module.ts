import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role.component';
import {RoleListComponent} from './list/role-list.component';
import {RoleEditComponent} from './edit/role-edit.component';
import {RoleAddComponent} from './add/role-add.component';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    canActivate: [ AuthGuard],
    data: {name: '角色管理', name_en: 'Role'},
    children: [
      {
        path: 'list',
        component: RoleListComponent,
        canActivate: [ AuthGuard],
        data: {name: '列表', name_en: 'List'},
      },
      {
        path: 'add',
        component: RoleAddComponent,
        canActivate: [ AuthGuard],
        data: {name: '新增', name_en: 'Add'},
      },
      {
        path: ':id',
        component: RoleEditComponent,
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
export class RoleRoutingModule { }
