import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {LoginRoutingModule} from './main-routing.module';
import {MainComponent} from './main.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    NgZorroAntdModule,
    LoginRoutingModule,
  ],
  bootstrap: [MainComponent]
})
export class MainModule { }
