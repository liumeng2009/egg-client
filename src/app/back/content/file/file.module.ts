import { NgModule } from '@angular/core';
import { FileComponent } from './file.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {FileRoutingModule} from './file-routing.module';
import {FileListComponent} from './list/file-list.component';
import {CategoryService} from '../category/category.service';
import {MyPipeModule} from '../../../util/myPipe.module';
import {FileService} from './file.service';
import {EditorModule} from '@tinymce/tinymce-angular';
import {PrettyJsonModule} from 'angular2-prettyjson';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    FileComponent,
    FileListComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    FileRoutingModule,
    MyPipeModule,
    EditorModule,
    PrettyJsonModule,
  ],
  providers: [
    CategoryService,
    FileService,
  ],
  bootstrap: [FileComponent],
})
export class FileModule { }
