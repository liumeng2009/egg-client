import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileComponent } from './file.component';
import {FileListComponent} from './list/file-list.component';
import {AuthGuard} from '../../main/authGuard.service';


const routes: Routes = [
  {
    path: '',
    component: FileComponent,
    canActivate: [AuthGuard],
    data: {name: '文件管理', name_en: 'File'},
    children: [
      {
        path: 'list',
        component: FileListComponent,
        canActivate: [AuthGuard],
        data: {name: '列表', name_en: 'List'},
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule { }
