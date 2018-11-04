import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleComponent } from './article.component';
import {ArticleListComponent} from './list/article-list.component';
import {ArticleEditComponent} from './edit/article-edit.component';
import {ArticleAddComponent} from './add/article-add.component';
import {TokenGuard} from '../../main/tokenGuard.service';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    canActivate: [TokenGuard, AuthGuard],
    data: {name: '栏目管理'},
    children: [
      {
        path: 'list',
        component: ArticleListComponent,
        canActivate: [TokenGuard, AuthGuard],
        data: {name: '列表'},
      },
      {
        path: 'add',
        component: ArticleAddComponent,
        canActivate: [TokenGuard, AuthGuard],
        data: {name: '新增'},
      },
      {
        path: ':id',
        component: ArticleEditComponent,
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
export class ArticleRoutingModule { }
