import {Component, OnInit} from '@angular/core';
import {ArticleCategory} from '../../../../bean/ArticleCategory';
import {FormGroup} from '@angular/forms';
import {Channel} from '../../../../bean/Channel';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../category.service';
import {ToolService} from '../../../../util/tool.service';
import {ResponseData} from '../../../../bean/responseData';
import {RememberService} from '../../../../util/remember.service';

@Component({
  selector: 'app-article-category-edit-page',
  templateUrl: './category-edit.component.html',
})

export class CategoryEditComponent implements OnInit {
  category: ArticleCategory = new ArticleCategory(null, null, null,
    null, null, null, null, null, true);
  validateForm: FormGroup;
  isLoading = false;
  categories: ArticleCategory[] = [];
  categoryList = false;
  categoryListError = '';
  isLoadingCategoryList = false;
  channel: Channel;
  channelList = false;
  channelListError = '';
  isLoadingchannel = false;
  formHeight = {
    height : '0px'
  }
  saveBtn = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toolService: ToolService,
    private rememberService: RememberService,
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const categoryId = params.id;
    });
  }
  getData(channelId) {
    this.isLoading = true;
    this.categoryService.getCategory(channelId).subscribe(
      (data: ResponseData) => {
        this.isLoading = false;
        this.toolService.apiResult(data, false).then((result: ResponseData) => {

        }).catch(() => {});
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  private initChannel(channelId) {
    this.isLoadingchannel = true;
    this.rememberService.setChannel(channelId);
    this.categoryService.showChannel(channelId).subscribe(
      (data: ResponseData) => {
        this.isLoadingchannel = false;
        this.toolService.apiResult(data, true).then(
          (result: ResponseData) => {
            this.channel = {...result.data};
            console.log(this.channel);
            this.channelList = true;
          }).catch((error) => {
          this.channelListError = error;
        });
      },
      error => {
        this.isLoadingchannel = false;
        this.channelListError = error;
      }
    );
  }
}
