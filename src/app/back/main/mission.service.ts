import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class MissionService {
  userInfoChange: EventEmitter<string>;

  constructor() {
    this.userInfoChange = new EventEmitter();
  }
}
