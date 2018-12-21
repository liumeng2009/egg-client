import {Component, OnInit} from '@angular/core';

@Component({
  templateUrl: './systemSetting.component.html',
  selector: 'app-system-setting-page',
  styleUrls: ['./systemSetting.component.scss'],
})

export class SystemSettingComponent implements OnInit {
  formHeight = {
    height : '0px'
  }
  constructor(

  ) {}
  ngOnInit() {
    this.initHeight();
  }
  private initHeight() {
    this.formHeight.height = (window.document.body.clientHeight - (53 + 64 + 69)) + 'px';
  }
}
