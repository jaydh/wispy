import * as React from 'react';
import Article from './Article';
import AddArticle from '../containers/AddArticle';
import Footer from './ArticleListFooter';
import ProjectSelector from '../containers/ProjectSelector';
import { List } from 'immutable';
import {
  Article as articleType,
  ArticleList as ArticleListType
} from '../constants/StoreState';
import { Jumbotron, ListGroup } from 'react-bootstrap';
const Rnd = require('react-rnd').default;

interface Props {
  articles: List<articleType>;
  order: number;
  id: string;
  articleList: ArticleListType;
  articleListNum: number;
}

class ArticleList extends React.Component<Props> {
  render() {
    const { articles, id, articleList } = this.props;
    return (
      <Jumbotron className="article-list-container">
        <h4>
          Count: {articles.size}
        </h4>
        <ProjectSelector id={id} />
        <Footer id={id} />
        <AddArticle articleList={articleList} />
        <ListGroup>
          {articles.map((article: articleType) => {
            return <Article key={article.id} {...article} />;
          })}
        </ListGroup>
      </Jumbotron>
    );
  }
}

class OuterArticleList extends React.Component<Props> {
  render() {
    const { order } = this.props;
    const width = innerWidth * 0.7;

    return (
      <Rnd
        className="resizable-container"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
        default={{
          x: width * order,
          y: 0,
          width: width,
          height: innerHeight * 0.8
        }}
        z={order}
        bounds=".canvas"
        dragHandlerClassName=".drag"
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false
        }}
        resizeHandlerStyles={{
          bottomRight: {
            border: 'solid #1290bf',
            borderWidth: '0 6px 6px 0',
            display: 'inline-block',
            padding: '3px',
            position: 'fixed'
          }
        }}
      >
        <i className="drag" />
        <ArticleList {...this.props} />
      </Rnd>
    );
  }
}
export default OuterArticleList;
