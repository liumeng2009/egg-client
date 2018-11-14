import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import {TokenGuard} from '../../main/tokenGuard.service';


const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    canActivate: [ TokenGuard],
    data: {name: '个人设置'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
