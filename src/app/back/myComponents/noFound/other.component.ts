import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-nofound-page',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})

export class OtherComponent implements OnInit {

  constructor(
    private title: Title,
    private lo: Location,
  ) {}
  ngOnInit() {
    this.title.setTitle('页面未找到');
  }
  private goBack() {
    this.lo.back();
  }
}
