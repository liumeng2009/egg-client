import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgZorroAntdModule, NZ_I18N, NZ_ICONS, zh_CN} from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {AppRoutingModule} from './app-routing.module';
import {ToolService} from './util/tool.service';
import {TokenGuard} from './back/main/tokenGuard.service';
import {AuthService} from './back/auth/auth.service';
import {RememberService} from './back/main/remember.service';
import {OtherComponent} from './back/myComponents/noFound/other.component';
import {RoleService} from './back/auth/role/role.service';
import {UserService} from './back/auth/user/user.service';
import {AuthGuard} from './back/main/authGuard.service';
import {NoAuthComponent} from './back/myComponents/noAuth/noAuth.component';
import {MissionService} from './back/main/mission.service';
import {CookieModule} from 'ngx-cookie';
import { IconDefinition } from '@ant-design/icons-angular';
import { PlusCircleOutline,
  DeleteOutline,
  ReloadOutline,
  UserOutline,
  SettingOutline,
  LogoutOutline,
  LoadingOutline,
  QuestionCircleOutline,
  SaveOutline,
  RollbackOutline,
  BookOutline,
  AppstoreOutline,
  HomeOutline,
  DownOutline,
  FilterOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  FolderOpenOutline,
  MinusOutline,
  FileOutline,
  RadiusBottomleftOutline,
} from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [ PlusCircleOutline, DeleteOutline, ReloadOutline, UserOutline, SettingOutline,
  LogoutOutline,
  LoadingOutline,
  QuestionCircleOutline,
  SaveOutline,
  RollbackOutline,
  BookOutline,
  AppstoreOutline,
  HomeOutline,
  DownOutline,
  FilterOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  FolderOpenOutline,
  MinusOutline,
  FileOutline,
  RadiusBottomleftOutline,
];

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    OtherComponent,
    NoAuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
    CookieModule.forRoot(),
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_ICONS, useValue: icons },
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
