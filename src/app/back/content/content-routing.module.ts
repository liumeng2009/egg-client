import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './content.component';
import {AuthGuard} from '../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [AuthGuard],
    data: {name: '网站内容管理', name_en: 'Content'},
    children: [
      {
        path: 'category',
        loadChildren: './category/category.module#CategoryModule',
      },
      {
        path: 'article',
        loadChildren: './article/article.module#ArticleModule',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
