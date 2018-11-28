import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {Title} from '@angular/platform-browser';
import {en_US, NzI18nInterface, NzI18nService, zh_CN} from 'ng-zorro-antd';
import {MyLocaleService} from './mylocale.service';
import {MissionService} from '../util/mission.service';
import {appZh} from '../../locale/zh';
import {appEn} from '../../locale/en';

@Component({
  selector: 'app-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})

export class DefaultComponent implements OnInit {
  array = [ 1, 2, 3, 4 ];
  locale = {};
  constructor(
    private title: Title,
    private myLocaleService: MyLocaleService,
    private missionService: MissionService,
  ) {}

  ngOnInit() {
    this.title.setTitle('首页');
    this.initMyLocale();
    this.missionService.langChange.subscribe((lang) => {
      switch (lang) {
        case 'zh-cn':
          this.locale = appZh;
          break;
        case 'en':
          this.locale = appEn;
          break;
        default:
          this.locale = appZh;
      }
    });
  }
  initMyLocale() {
    this.locale = this.myLocaleService.getMyLocale();
  }
}
