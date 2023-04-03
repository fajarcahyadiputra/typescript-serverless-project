export interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}
//omit for remove key id and createdAt
export interface NewArticle extends Omit<Article, "id" | "createdAt"> {}
