import {Pipe, PipeTransform} from '@angular/core';
import {Location} from '@angular/common';


@Pipe({name: 'numberArray'})
export class NumberArrayPipe implements PipeTransform {
  transform(value: number) {
    let res = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }
}
