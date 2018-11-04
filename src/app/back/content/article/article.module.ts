import { NgModule } from '@angular/core';
import { ArticleComponent } from './article.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {ArticleRoutingModule} from './article-routing.module';
import {ArticleAddComponent} from './add/article-add.component';
import {ArticleEditComponent} from './edit/article-edit.component';
import {ArticleListComponent} from './list/article-list.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleAddComponent,
    ArticleEditComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ArticleRoutingModule,
  ],
  bootstrap: [ArticleComponent],
})
export class ArticleModule { }
