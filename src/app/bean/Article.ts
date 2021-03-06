import {ArticleAlbum} from './ArticleAlbum';

export class Article {
  constructor(
    public id: number,
    public channelId: number,
    public categoryId: number,
    public title: string,
    public code: string,
    public imgUrl: string,
    public zhaiyao: string,
    public content: string,
    public sort: number,
    public click: number,
    public status: number,
    public isComment: boolean,
    public isTop: boolean,
    public isRed: boolean,
    public isHot: boolean,
    public isSlide: boolean,
    public author: number,
    public auditing: number,
    public publishAt: string,
    public checked: boolean,
    public article_category: any,
    public article_albums: ArticleAlbum[],
    public isElastic: boolean,
  ) {  }
}

export class ArticleProperty {
  constructor (
    public name: string,
    public value: any,
    public checked: boolean,
  ) {}
}
