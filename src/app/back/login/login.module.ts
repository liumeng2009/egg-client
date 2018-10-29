import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import {LoginService} from './login.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {CommonModule} from '@angular/common';
import {LoginRoutingModule} from './login-routing.module';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [     /* These are NgModule imports. */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    LoginRoutingModule,
  ],
  providers: [
    LoginService,
  ],
  bootstrap: [LoginComponent]
})
export class LoginModule { }
