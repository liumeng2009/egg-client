import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontMainComponent } from './main.component';


const routes: Routes = [
  {
    path: '',
    component: FrontMainComponent,
    children: [
      {
        path: 'article',
        loadChildren: '../detail/detail.module#DetailModule',
      },
      {
        path: 'about',
        loadChildren: '../about/about.module#AboutModule',
      },
      {
        path: 'list',
        loadChildren: '../list/list.module#ListModule',
      },
      {
        path: '',
        loadChildren: '../default.module#DefaultModule',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontMainRoutingModule { }
