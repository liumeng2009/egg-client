import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {ArticleService} from '../back/content/article/article.service';
import {ResponseData} from '../bean/responseData';
import {ToolService} from '../util/tool.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss', '../../assets/css/dosearch.css'],
  encapsulation: ViewEncapsulation.None,
})

export class DefaultComponent implements OnInit {
  searchKey = '';
  options = [];
  client: any = {};
  index: any = {};
  packages$: Observable<any[]>;
  searchText$ = new Subject<any>();
  @ViewChild('search') searchInput;
  showSearchBox = false;
  isSearchLoading = false;
  searchResult = [];
  array = [ 1, 2, 3, 4 ];
  @ViewChild('search') public anchorOp: ElementRef;
  @ViewChild('popupOp', { read: ElementRef }) public popupOp: ElementRef;
  constructor(
    private title: Title,
    private articleService: ArticleService,
    private toolService: ToolService,
  ) {

    this.packages$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    );
  }

  ngOnInit() {
    this.title.setTitle('首页');
    this.packages$.subscribe( (value) => {
      console.log('关键字有效');
      this.searchFromAlgolia(value);
    });
  }

  searchFromAlgolia(value) {
    if (value === '') {
      return;
    }
    this.showSearchBox = true;
    this.isSearchLoading = true;
    const t = this;
    this.articleService.searchByElastic(value).subscribe(
      (data: ResponseData) => {
        this.isSearchLoading = false;
        this.toolService.apiResult(data, true).then(
          (result: ResponseData) => {
            console.log(result);
            this.searchResult = result.data;
            if (result.data.hits && result.data.hits.hits) {
              this.formatSearchResult(result.data);
              console.log(this.options);
            }
          }
        ).catch(() => {});
      },
      error => {
        this.isSearchLoading = false;
      },
    );
  }

  formatSearchResult(searchResult: any) {
    this.options.splice(0, this.options.length);
    const groupByChannel = searchResult.aggregations.group_by_channel.buckets;
    const articles = searchResult.hits.hits;
    for (const group of groupByChannel) {
      const option = {
        channel: group.key,
        categories: [],
      };
      this.options.push(option);
      for (let article of articles) {
        article = this.setHightLight(article);
        console.log(article)
        const _article = article._source;
        if (group.key === _article.channel) {
          const isExistCategory = this.isExistCategory(option.categories, _article.category);
          if (isExistCategory) {
            isExistCategory.articles.push(_article);
          } else {
            const newCategory = {
              category: _article.category,
              articles: [
                _article
              ],
            };
            option.categories.push(newCategory);
          }
        }
      }
    }
    console.log(this.options);
  }

  isExistCategory(categories, category) {
    if (categories.length === 0) {
      return false;
    }
    for (const cate of categories) {
      if (cate.category === category) {
        return cate;
      }
    }
    return false;
  }

  setHightLight(article) {
    const _article = article._source;
    const hightlight = article.highlight;
    for (const prop in hightlight) {
      _article[prop] = hightlight[prop][0];
    }
    return article;
  }

  onInput(value: string): void {
    this.searchText$.next(value);
  }


  private contains(target: any): boolean {
    return this.anchorOp.nativeElement.contains(target) ||
      (this.popupOp ? this.popupOp.nativeElement.contains(target) : false);
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showSearchBox = false;
    }
  }
}
