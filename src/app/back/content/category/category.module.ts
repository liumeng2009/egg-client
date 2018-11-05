import { NgModule } from '@angular/core';
import { CategoryComponent } from './category.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {CategoryRoutingModule} from './category-routing.module';
import {CategoryAddComponent} from './add/category-add.component';
import {CategoryEditComponent} from './edit/category-edit.component';
import {CategoryListComponent} from './list/category-list.component';
import {CategoryService} from './category.service';
import {MyPipeModule} from '../../../util/myPipe.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    CategoryComponent,
    CategoryListComponent,
    CategoryAddComponent,
    CategoryEditComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CategoryRoutingModule,
    MyPipeModule,
  ],
  providers: [
    CategoryService,
  ],
  bootstrap: [CategoryComponent],
})
export class CategoryModule { }
