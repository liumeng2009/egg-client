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
import {ToolService} from './util/tool.service';
import {CookieService} from 'angular2-cookie/core';
import {TokenGuard} from './back/main/tokenGuard.service';
import {AuthService} from './back/auth/auth.service';
import {RememberService} from './back/main/remember.service';
import {OtherComponent} from './back/myComponents/noFound/other.component';
import {RoleService} from './back/auth/role/role.service';
import {UserService} from './back/auth/user/user.service';
import {RoleAuthComponent} from './back/auth/role/list/role-auth.component';
import {AuthGuard} from './back/main/authGuard.service';
import {NoAuthComponent} from './back/myComponents/noAuth/noAuth.component';
import {MissionService} from './back/main/mission.service';

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
    MissionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
