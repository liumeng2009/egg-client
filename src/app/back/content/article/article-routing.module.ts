import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleComponent } from './article.component';
import {ArticleListComponent} from './list/article-list.component';
import {ArticleEditComponent} from './edit/article-edit.component';
import {ArticleAddComponent} from './add/article-add.component';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    canActivate: [AuthGuard],
    data: {name: '内容管理'},
    children: [
      {
        path: 'list',
        component: ArticleListComponent,
        canActivate: [AuthGuard],
        data: {name: '列表'},
      },
      {
        path: 'add',
        component: ArticleAddComponent,
        canActivate: [AuthGuard],
        data: {name: '新增'},
      },
      {
        path: ':id',
        component: ArticleEditComponent,
        canActivate: [AuthGuard],
        data: {name: '编辑'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
