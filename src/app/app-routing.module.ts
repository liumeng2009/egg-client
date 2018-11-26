import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OtherComponent} from './back/myComponents/noFound/other.component';
import {NoAuthComponent} from './back/myComponents/noAuth/noAuth.component';

const routes: Routes = [
  {path: '', loadChildren: './front/main/main.module#MainModule'},
  {path: 'admin/login', loadChildren: './back/login/login.module#LoginModule'},
  {path: 'admin', loadChildren: './back/main/main.module#MainModule'},
  {path: 'noauth', component: NoAuthComponent, data: {name: '没有权限访问该页面'}},
  {path: '**', component: OtherComponent, data: {name: '页面未找到'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
