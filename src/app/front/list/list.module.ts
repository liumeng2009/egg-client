import { NgModule } from '@angular/core';
import { ListComponent  } from './list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {ListRoutingModule} from './list-routing.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    ListComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ListRoutingModule,
  ],
  providers: [

  ],
  bootstrap: [ListComponent]
})
export class ListModule { }
