import {Component, OnInit} from '@angular/core';
import algoliasearch from 'algoliasearch';
import {AlgoliaConfig, AlgoliaQueryConfig} from '../config/algolia'

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

  constructor() {
    this.client = algoliasearch(
      'Y2MNOEONET',
      'a729eedd4490cfd5898cdc2f0bc672f9'
    );
    this.index = this.client.initIndex('demo_egg');
    console.log(this.index);
  }

  ngOnInit() {

  }

  onInput(value: string): void {
    this.options = value ? [
      value,
      value + value,
      value + value + value
    ] : [];
    this.index.setSettings(AlgoliaConfig);
    this.index.batchRules(AlgoliaQueryConfig);
    this.index.search({value}, function searchDone(err, content) {
        if (err) {
          throw err;
        }
        console.log(content.hits);
    });
  }
}
