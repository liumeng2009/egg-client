import { Component } from '@angular/core';

@Component({
  template: `
    <h1 *ngIf="showInfo">网站内容管理</h1>
        <router-outlet (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'></router-outlet>
    `
})

export class ContentComponent {
  showInfo = true;

  onActivate(e) {
    this.showInfo = false;
  }
  onDeactivate(e) {
    this.showInfo = true;
  }
}
