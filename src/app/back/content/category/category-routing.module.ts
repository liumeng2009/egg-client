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
    data: {name: '栏目管理', name_en: 'Category'},
    children: [
      {
        path: 'list',
        component: CategoryListComponent,
        canActivate: [ AuthGuard],
        data: {name: '列表', name_en: 'List'},
      },
      {
        path: 'add',
        component: CategoryAddComponent,
        canActivate: [ AuthGuard],
        data: {name: '新增', name_en: 'Add'},
      },
      {
        path: ':id',
        component: CategoryEditComponent,
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
export class CategoryRoutingModule { }
