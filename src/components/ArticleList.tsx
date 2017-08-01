import * as React from 'react';
import Article from './Article';
import { Article as articleType } from '../constants/StoreState';

interface Props {
  articles: articleType[];
  SyncArticles: any;
  ListenToFirebase: any;
  onArticleClick: any;
}

class ArticleList extends React.Component<Props, {}> {
  componentWillMount() {
    const { SyncArticles, ListenToFirebase } = this.props;
    SyncArticles();
    ListenToFirebase();
  }
  render() {
    const { articles, onArticleClick } = this.props;
    return (
      <div className="Col-lg-3 Col-md-3">
        <ul>
          {articles.map(article =>
            <Article
              key={article.id}
              {...article}
              onClick={() => onArticleClick(article.id)}
            />
          )}
        </ul>
      </div>
    );
  }
}
export default ArticleList;
