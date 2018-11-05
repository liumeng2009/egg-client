export class Article {
  constructor(
    public channelId: number,
    public categoryId: number,
    public title: string,
    public img_url: string,
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
    public author: string,
    public auditing: string,
    public publishAt: Date,
    public checked: boolean,
  ) {  }
}
