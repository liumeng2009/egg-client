import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import {UserListComponent} from './list/user-list.component';
import {UserEditComponent} from './edit/user-edit.component';
import {UserAddComponent} from './add/user-add.component';


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'list',
        component: UserListComponent,
        data: {name: '列表'},
      },
      {
        path: 'edit',
        component: UserEditComponent,
        data: {name: '编辑'},
      },
      {
        path: 'add',
        component: UserAddComponent,
        data: {name: '新增'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
