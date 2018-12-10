import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {AboutRoutingModule} from './about-routing.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    AboutRoutingModule,
  ],
  providers: [

  ],
  bootstrap: [AboutComponent]
})
export class AboutModule { }
