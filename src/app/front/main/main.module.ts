import { NgModule } from '@angular/core';
import {FrontMainComponent} from './main.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {FrontMainRoutingModule} from './main-routing.module';
import { NgProgressModule } from '@ngx-progressbar/core';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    FrontMainComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    FrontMainRoutingModule,
    NgProgressModule.forRoot(),
  ],
  providers: [],
  bootstrap: [FrontMainComponent]
})
export class MainModule { }
