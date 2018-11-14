import { NgModule } from '@angular/core';
import { SettingComponent } from './setting.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {SettingRoutingModule} from './setting-routing.module';
import {PasswordComponent} from './password.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    SettingComponent,
    PasswordComponent,
  ],
  entryComponents: [
    PasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SettingRoutingModule,
  ],
  bootstrap: [SettingComponent]
})
export class SettingModule { }
