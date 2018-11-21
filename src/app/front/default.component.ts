import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import algoliasearch from 'algoliasearch';
import {AlgoliaConfig, AlgoliaQueryConfig} from '../config/algolia';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

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
  constructor(

  ) {
    this.client = algoliasearch(
      'Y2MNOEONET',
      'a729eedd4490cfd5898cdc2f0bc672f9'
    );
    this.index = this.client.initIndex('demo_egg');
    this.packages$ = this.searchText$.pipe(
      debounceTime(500),
    );
  }

  ngOnInit() {
    this.packages$.subscribe( (value) => {
      this.searchFromAlgolia(value);
    });
  }

  searchFromAlgolia(value) {
    if (value === '') {
      return;
    }
    const t = this;
    this.index.setSettings(AlgoliaConfig);
    this.index.batchRules(AlgoliaQueryConfig);
    this.index.search({query: value}, function searchDone(err, content) {
      if (err) {
        throw err;
      }
/*      for (const result of content.hits) {
        t.options.push({title: result.title});
      }*/
      t.options = [...content.hits];
      console.log(t.options);
      t.showSearchBox = true;
      // return content.hits;
    });
    // return null;
  }

  onInput(value: string): void {
    this.searchText$.next(value);
  }

  @ViewChild('search') public anchorOp: ElementRef;
  @ViewChild('popupOp', { read: ElementRef }) public popupOp: ElementRef;
  private contains(target: any): boolean {
    return this.anchorOp.nativeElement.contains(target) ||
      (this.popupOp ? this.popupOp.nativeElement.contains(target) : false);
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    console.log('click');
    if (!this.contains(event.target)) {
      this.showSearchBox = false;
    }
  }
}
