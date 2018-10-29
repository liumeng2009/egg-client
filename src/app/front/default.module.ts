import { NgModule } from '@angular/core';
import { DefaultComponent } from './default.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {DefaultRoutingModule} from './default-routing.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    DefaultComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    DefaultRoutingModule,
  ],
  bootstrap: [DefaultComponent]
})
export class DefaultModule { }
