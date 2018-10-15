import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './back/login/login.component';
import {MainComponent} from './back/main/main.component';
import {TokenGuard} from './back/main/tokenGuard.service';

const routes: Routes = [
  {path: '', redirectTo: '/admin', pathMatch: 'full'},
  {path: 'login', component: LoginComponent },
  {path: 'admin', component: MainComponent, canActivate: [TokenGuard], children: []},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
