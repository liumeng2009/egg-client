import { NgModule } from '@angular/core';
import { ContentComponent } from './content.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {ContentRoutingModule} from './content-routing.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ContentRoutingModule,
  ],
  bootstrap: [ContentComponent],
})
export class ContentModule { }
