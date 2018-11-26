import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-list-page',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent implements OnInit {
  articleId = 0;
  constructor(
    private title: Title,
  ) {}
  ngOnInit() {
    this.title.setTitle('列表页');
  }
}
