import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalComponent } from './total.component';
import {TokenGuard} from '../main/tokenGuard.service';


const routes: Routes = [
  {
    path: '',
    component: TotalComponent,
    canActivate: [TokenGuard],
    data: {name: '网站信息'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalRoutingModule { }
