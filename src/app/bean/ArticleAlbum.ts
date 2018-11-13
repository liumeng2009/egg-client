export class ArticleAlbum {
  constructor(
    public id: number,
    public articleId: number,
    public origin_path: string,
    public thumb_path: string,
    public remark: string,
    public action: string,
  ) {  }
}
