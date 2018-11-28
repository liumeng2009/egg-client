import {Component, OnInit} from '@angular/core';

import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})

export class DefaultComponent implements OnInit {
  array = [ 1, 2, 3, 4 ];
  constructor(
    private title: Title,
  ) {}

  ngOnInit() {
    this.title.setTitle('首页');
  }
}
