import { Component } from '@angular/core';

@Component({
  template: `
    <h1 *ngIf="showInfo">用户权限管理</h1>
        <router-outlet (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'></router-outlet>
    `
})

export class AuthComponent {
  private showInfo = true;

  private onActivate() {
    this.showInfo = false;
  }
  private onDeactivate() {
    this.showInfo = true;
  }
}
