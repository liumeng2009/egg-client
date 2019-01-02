import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {SystemSettingRoutingModule} from './systemSetting-routing.module';
import {SystemSettingComponent} from './systemSetting.component';
import {LoginService} from '../login/login.service';
import {SystemSettingService} from './systemSetting.service';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    SystemSettingComponent
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    NgZorroAntdModule,
    SystemSettingRoutingModule,
  ],
  bootstrap: [SystemSettingComponent],
  providers: [
    SystemSettingService,
  ],
})
export class SystemSettingModule { }
