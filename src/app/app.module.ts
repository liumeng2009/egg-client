import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './back/login/login.component';
import {ToolService} from './util/tool.service';
import {MainComponent} from './back/main/main.component';
import {CookieService} from 'angular2-cookie/core';
import {TokenGuard} from './back/main/tokenGuard.service';
import {AuthService} from './back/auth/auth.service';
import {RememberService} from './back/main/remember.service';
import {AuthComponent} from './back/auth/auth.component';
import {UserComponent} from './back/auth/user/user.component';
import {UserListComponent} from './back/auth/user/list/user-list.component';
import {UserAddComponent} from './back/auth/user/add/user-add.component';
import {UserEditComponent} from './back/auth/user/edit/user-edit.component';
import {TotalComponent} from './back/total/total.component';
import {OtherComponent} from './back/myComponents/noFound/other.component';
import {RoleComponent} from './back/auth/role/role.component';
import {RoleListComponent} from './back/auth/role/list/role-list.component';
import {RoleAddComponent} from './back/auth/role/add/role-add.component';
import {RoleEditComponent} from './back/auth/role/edit/role-edit.component';
import {RoleService} from './back/auth/role/role.service';
import {UserService} from './back/auth/user/user.service';
import {RoleAuthComponent} from './back/auth/role/list/role-auth.component';
import {AuthGuard} from './back/main/authGuard.service';
import {NoAuthComponent} from './back/myComponents/noAuth/noAuth.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    OtherComponent,
    NoAuthComponent,
    RoleAuthComponent,
  ],
  entryComponents: [
    RoleAuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    CookieService,
    ToolService,
    RememberService,
    TokenGuard,
    AuthGuard,
    AuthService,
    RoleService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
