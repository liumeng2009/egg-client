import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MissionService} from '../main/mission.service';

@Component({
  templateUrl: './total.component.html',
  selector: 'app-total-page'
})

export class TotalComponent implements OnInit {
  constructor(
    private title: Title,
  ) {}
  ngOnInit() {
    this.title.setTitle('网站信息');
  }
}
