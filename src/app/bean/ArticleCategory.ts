export class ArticleCategory {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public channelId: number,
    public parentId: number,
    public parent_list: string,
    public level: number,
    public sort: number,
    public checked: boolean,
  ) {  }
}
