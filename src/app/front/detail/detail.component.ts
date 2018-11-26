import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})

export class DetailComponent implements OnInit {
  articleId = 0;
  constructor(
    private title: Title,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.title.setTitle('详情页');
    this.route.params.subscribe((params: Params) => {
      this.articleId = params.id;
    });
  }
}
