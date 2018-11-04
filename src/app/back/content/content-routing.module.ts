import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './content.component';
import {TokenGuard} from '../main/tokenGuard.service';


const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    canActivate: [TokenGuard],
    data: {name: '网站内容管理'},
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
