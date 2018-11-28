import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {NgProgress, NgProgressRef} from '@ngx-progressbar/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ResponseData} from '../../bean/responseData';
import {ToolService} from '../../util/tool.service';
import {PublicDataService} from '../public-data.service';

@Component({
  selector: 'app-front-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', '../../../assets/css/dosearch.css'],
  encapsulation: ViewEncapsulation.None,
})

export class FrontMainComponent implements OnInit {
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
  @ViewChild('search') public anchorOp: ElementRef;
  @ViewChild('popupOp', { read: ElementRef }) public popupOp: ElementRef;
  progressRef: NgProgressRef;
  selectedLang = '';
  constructor(
    private router: Router,
    private progressService: NgProgress,
    private publicDataService: PublicDataService,
    private toolService: ToolService,
  ) {
    this.progressRef = this.progressService.ref();
    this.packages$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    );
  }
  ngOnInit() {
    this.addRouteListener();
    this.packages$.subscribe( (value) => {
      console.log('关键字有效');
      this.searchFromAlgolia(value);
    });
    this.initLang();
  }
  addRouteListener() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof  NavigationStart) {
          this.progressRef.start();
        }
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          this.progressRef.complete();
        }
      });
  }
  searchFromAlgolia(value) {
    if (value === '') {
      return;
    }
    this.showSearchBox = true;
    this.isSearchLoading = true;
    const t = this;
    this.publicDataService.searchByElastic(value).subscribe(
      (data: ResponseData) => {
        this.isSearchLoading = false;
        this.toolService.apiResult(data, true).then(
          (result: ResponseData) => {
            this.searchResult = result.data;
            if (result.data.hits && result.data.hits.hits) {
              this.formatSearchResult(result.data);
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
  initLang() {
    const pathname = location.pathname;
    if (pathname.indexOf('/zh/') > -1) {
      this.selectedLang = 'zh';
    } else if (pathname.indexOf('/en/') > -1) {
      this.selectedLang = 'en';
    } else {
      this.selectedLang = 'zh';
    }
  }
  switchLanguage(lang) {
    console.log(location);
    const origin = location.origin;
    const pathname = location.pathname;
    let newPathName = '';
    switch (lang) {
      case 'zh':
        newPathName = '/zh/' + pathname.substring(4, pathname.length - 1);
        break;
      case 'en':
        newPathName = '/en/' + pathname.substring(4, pathname.length - 1);
        break;
      default:
        newPathName = '/zh/' + pathname.substring(4, pathname.length - 1);
    }
    location.href = origin + newPathName;
  }
}
