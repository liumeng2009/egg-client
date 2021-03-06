import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PublicDataService} from '../public-data.service';
import {ResponseData} from '../../bean/responseData';
import {ToolService} from '../../util/tool.service';
import {Article} from '../../bean/Article';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})

export class DetailComponent implements OnInit {
  article: Article;
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private publicDataService: PublicDataService,
    private toolService: ToolService,
  ) {}
  ngOnInit() {
    this.title.setTitle('详情页');
    this.route.params.subscribe((params: Params) => {
      this.getData(params.id);
    });
  }
  getData(id) {
    this.publicDataService.articleShow(id).subscribe(
      (data: ResponseData) => {
        this.toolService.apiResult(data, false).then((result: ResponseData) => {
          this.article = {...result.data};
        }).catch(() => {
          this.article = null;
        });
      },
      error => {}
    );
  }
}
