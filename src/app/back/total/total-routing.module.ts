import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalComponent } from './total.component';


const routes: Routes = [
  {
    path: '',
    component: TotalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalRoutingModule { }
