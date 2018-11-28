import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class MissionService {
  userInfoChange: EventEmitter<string>;
  langChange: EventEmitter<string>;
  constructor() {
    this.userInfoChange = new EventEmitter();
    this.langChange = new EventEmitter();
  }
}
