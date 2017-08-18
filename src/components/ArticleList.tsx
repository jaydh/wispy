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
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
const Resizable = require('react-resizable').ResizableBox;
const Draggable = require('react-draggable');

interface Props {
  articles: List<articleType>;
  id: string;
  filters: ArticleListType;
}
interface State {
  width: number;
  height: number;
  activeDrags: number;
  deltaPosition: { x: number; y: number };
}
class ArticleList extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      width: 600,
      height: 200,
      activeDrags: 0,
      deltaPosition: {
        x: 0,
        y: 0
      }
    };
    this.onResize = this.onResize.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
  }

  onResize = (event: any, t: { element: any; size: any }) => {
    this.setState({ width: t.size.width, height: t.size.height });
  };

  onStart() {
    this.setState({ activeDrags: this.state.activeDrags + 1 });
  }

  onStop() {
    this.setState({ activeDrags: this.state.activeDrags - 1 });
  }

  handleDrag(e: any, ui: any) {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  }

  render() {
    const { articles, id, filters } = this.props;
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };

    return (
      <Draggable handle="strong" {...dragHandlers}>
        <div
          className=" no-cursor"
          style={{
            position: 'relative',
            padding: '0',
            height: this.state.height,
            width: this.state.width
          }}
        >
          <strong className="cursor">
            <Button>Drag here</Button>
          </strong>

          <Resizable
            className="box"
            onResize={this.onResize}
            minConstraints={[600, 200]}
            height={this.state.height}
            width={this.state.width}
          >
            <AddArticle filters={filters} />
            <ProjectSelector id={id} />
            <ListGroup className="article-list">
              {articles.map(article => {
                return article
                  ? <ListGroupItem
                      key={article.id}
                      bsStyle={article.completed ? 'success' : 'info'}
                    >
                      <Article key={article.id} {...article} />
                    </ListGroupItem>
                  : <br />;
              })}
            </ListGroup>
            <Footer id={id} />
          </Resizable>
        </div>
      </Draggable>
    );
  }
}
export default ArticleList;
