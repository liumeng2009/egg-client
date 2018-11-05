import { NgModule } from '@angular/core';
import {NumberArrayPipe} from './numberArray.pipe';

@NgModule({
  declarations: [
    NumberArrayPipe,
  ],
  imports: [

  ],
  exports: [
    NumberArrayPipe,
  ]
})
export class MyPipeModule { }
