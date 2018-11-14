import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import {TokenGuard} from './tokenGuard.service';



const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [TokenGuard],
    children: [
      {
        path: 'total',
        loadChildren: '../total/total.module#TotalModule',
      },
      {
        path: 'auth',
        loadChildren: '../auth/auth.module#AuthModule',
      },
      {
        path: 'content',
        loadChildren: '../content/content.module#ContentModule',
      },
      {
        path: 'setting',
        loadChildren: '../auth/setting/setting.module#SettingModule'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
