import {Component, OnInit, ViewChild} from '@angular/core';
import algoliasearch from 'algoliasearch';
import {AlgoliaConfig, AlgoliaQueryConfig} from '../config/algolia';
import {fromEvent, Observable, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, tap, map} from 'rxjs/operators';
import {ResponseData} from '../bean/responseData';
import {HttpHeaders} from '@angular/common/http';
import {AuthService} from '../back/auth/auth.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})

export class DefaultComponent implements OnInit {
  searchKey = '';
  options = [];
  client: any = {};
  index: any = {};
  packages$: Observable<any[]>;
  searchText$ = new Subject<string>();
  @ViewChild('search') searchInput;
  constructor(
    private articleService: AuthService,
  ) {
    this.client = algoliasearch(
      'Y2MNOEONET',
      'a729eedd4490cfd5898cdc2f0bc672f9'
    );
    this.index = this.client.initIndex('demo_egg');
  }

  ngOnInit() {
    console.log(123);
/*    this.packages$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => {
        const str = this.searchFromAlgolia(value);
        console.log(str);
        return str;
      })
    );*/
    this.searchText$.subscribe( (value) => {
      console.log(value);
    })
    this.searchText$.pipe(
      debounceTime(1000),
      map( (value) => {
        console.log(value);
        return this.searchFromAlgolia(value);
      })
    );
    const it = fromEvent(this.searchInput.nativeElement, 'keyup');
    console.log(it);
    const result = it.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((value) => {
        console.log(value)
        const str = this.searchFromAlgolia(value);
        console.log(str);
        return this.articleService.checkToken();
      })
    )
    result.subscribe(x => console.log(x));
  }

  searchFromAlgolia(value): Observable<any> {
    console.log(value);
    this.index.setSettings(AlgoliaConfig);
    this.index.batchRules(AlgoliaQueryConfig);
    this.index.search({query: value}, function searchDone(err, content) {
      if (err) {
        throw err;
      }
      console.log(content.hits);
      return content.hits;
    });
    return null;
  }

  onInput(value: string): void {
    console.log(value);
    this.searchText$.next(value);
/*    this.options = value ? [
      value,
      value + value,
      value + value + value
    ] : [];
    this.index.setSettings(AlgoliaConfig);
    this.index.batchRules(AlgoliaQueryConfig);
    this.index.search({query: value}, function searchDone(err, content) {
        if (err) {
          throw err;
        }
        console.log(content.hits);
    });*/
  }
}
