import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})

export class DefaultComponent implements OnInit {
  constructor(
    private title: Title,
  ) {}

  ngOnInit() {
    this.title.setTitle('首页');
  }
}
