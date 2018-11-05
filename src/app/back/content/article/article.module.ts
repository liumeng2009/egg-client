import { NgModule } from '@angular/core';
import { ArticleComponent } from './article.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule, NZ_ICONS} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {ArticleRoutingModule} from './article-routing.module';
import {ArticleAddComponent} from './add/article-add.component';
import {ArticleEditComponent} from './edit/article-edit.component';
import {ArticleListComponent} from './list/article-list.component';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  AuditOutline,
} from '@ant-design/icons-angular/icons';
import {CategoryService} from '../category/category.service';
import {MyPipeModule} from '../../../util/myPipe.module';
import {EditorModule} from '@tinymce/tinymce-angular';
import {ArticleService} from './article.service';

const icons: IconDefinition[] = [
  AuditOutline,
];

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
    MyPipeModule,
    EditorModule
  ],
  providers: [
    { provide: NZ_ICONS, useValue: icons },
    CategoryService,
    ArticleService,
  ],
  bootstrap: [ArticleComponent],
})
export class ArticleModule { }
