import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {TotalRoutingModule} from './total-routing.module';
import {TotalComponent} from './total.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    TotalComponent
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    NgZorroAntdModule,
    TotalRoutingModule,
  ],
  bootstrap: [TotalComponent]
})
export class TotalModule { }
