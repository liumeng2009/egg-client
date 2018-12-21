import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemSettingComponent } from './systemSetting.component';
import {TokenGuard} from '../main/tokenGuard.service';


const routes: Routes = [
  {
    path: '',
    component: SystemSettingComponent,
    canActivate: [TokenGuard],
    data: {name: '系统设置', name_en: 'System'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingRoutingModule { }
