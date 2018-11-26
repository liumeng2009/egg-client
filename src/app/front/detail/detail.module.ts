import { NgModule } from '@angular/core';
import { DetailComponent } from './detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {DetailRoutingModule} from './detail-routing.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    DetailComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    DetailRoutingModule,
  ],
  providers: [

  ],
  bootstrap: [DetailComponent]
})
export class DetailModule { }
