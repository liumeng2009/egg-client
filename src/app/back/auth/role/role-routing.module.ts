import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleComponent } from './role.component';
import {RoleListComponent} from './list/role-list.component';
import {RoleEditComponent} from './edit/role-edit.component';
import {RoleAddComponent} from './add/role-add.component';


const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    children: [
      {
        path: 'list',
        component: RoleListComponent,
        data: {name: '列表'},
      },
      {
        path: 'add',
        component: RoleAddComponent,
        data: {name: '新增'},
      },
      {
        path: ':id',
        component: RoleEditComponent,
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
