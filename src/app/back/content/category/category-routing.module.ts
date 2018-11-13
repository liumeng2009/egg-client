import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryComponent } from './category.component';
import {CategoryListComponent} from './list/category-list.component';
import {CategoryEditComponent} from './edit/category-edit.component';
import {CategoryAddComponent} from './add/category-add.component';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    canActivate: [ AuthGuard],
    data: {name: '栏目管理'},
    children: [
      {
        path: 'list',
        component: CategoryListComponent,
        canActivate: [ AuthGuard],
        data: {name: '列表'},
      },
      {
        path: 'add',
        component: CategoryAddComponent,
        canActivate: [ AuthGuard],
        data: {name: '新增'},
      },
      {
        path: ':id',
        component: CategoryEditComponent,
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
export class CategoryRoutingModule { }
