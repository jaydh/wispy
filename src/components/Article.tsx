import * as React from 'react';
import { connect } from 'react-redux';
import { Article as articleType } from '../constants/StoreState';
import { ArticleViewed } from '../actions/articles/articleViewed';
import AddArticleToProject from '../containers/actionDispatchers/AddArticleToProject';
import DeleteArticle from '../containers/actionDispatchers/DeleteArticle';
import ToggleArticle from '../containers/actionDispatchers/ToggleArticle';
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  Collapse,
  ListGroupItem,
  Container,
  Col,
  ButtonGroup,
  Row
} from 'reactstrap';
import LazyLoad from 'react-lazyload';
import { Icon } from 'react-fa';

interface Props {
  onArticleView: (t: string) => void;
  article: articleType;
  compact: boolean;
  scrolling: boolean;
}
interface State {
  isMenuOpen: boolean;
}

class Article extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  render() {
    const { onArticleView, article, compact } = this.props;
    const hasTitle = article.metadata
      ? article.metadata.has('title') || article.metadata.has('oGtitle')
      : false;
    const hasDescription = article.metadata
      ? article.metadata.has('description') ||
        article.metadata.has('ogDescrption')
      : false;
    const hasSiteName = article.metadata
      ? article.metadata.has('siteName') || article.metadata.has('ogSiteName')
      : false;

    const showImage =
      (!compact || this.state.isMenuOpen) &&
      article.metadata &&
      article.metadata.has('images');

    return (
      <ListGroupItem
        onMouseEnter={() => this.setState({ isMenuOpen: true })}
        onMouseLeave={() => this.setState({ isMenuOpen: false })}
        color={article.completed ? 'success' : 'info'}
      >
        <LazyLoad height="300" offset={600} overflow={false}>
          <Container>
            <Row>
              <Col
                xs={showImage ? 8 : 12}
                sm={showImage ? 8 : 12}
                md={showImage ? 10 : 12}
                lg={showImage ? 10 : 12}
              >
                <Card>
                  <CardTitle>
                    {article.fetching && <Icon spin={true} name="spinner" />}
                    <a
                      className="w-75 p-3"
                      style={{ textOverflow: 'ellipsis' }}
                      onClick={() => onArticleView(article.id)}
                      href={article.link}
                      target="_blank"
                    >
                      {hasTitle
                        ? article.metadata.get('title') ||
                          article.metadata.get('ogTitle')
                        : article.link}
                    </a>
                    {this.state.isMenuOpen && (
                      <ButtonGroup style={{ float: 'right' }} size="sm">
                        <ToggleArticle id={article.id} />
                        <DeleteArticle id={article.id} />
                      </ButtonGroup>
                    )}
                  </CardTitle>
                  <Collapse isOpen={this.state.isMenuOpen}>
                    <CardSubtitle>
                      {hasSiteName
                        ? article.metadata.get('siteName') ||
                          article.metadata.get('ogSiteName')
                        : ''}
                      {hasSiteName && hasDescription ? ' - ' : ''}
                      {hasDescription
                        ? article.metadata.get('ogDescrption') ||
                          article.metadata.get('description')
                        : ''}
                    </CardSubtitle>
                    <CardBody>
                      {article.dateAdded ? (
                        <small>
                          Date added: {article.dateAdded.toLocaleDateString()}{' '}
                          <br />
                        </small>
                      ) : (
                        ''
                      )}
                      {!article.viewedOn.isEmpty() ? (
                        <small>
                          {`Last viewed on ${article.viewedOn
                            .last()
                            .toLocaleString()}
                        - viewed ${article.viewedOn.size} time(s)`}
                          <br />
                        </small>
                      ) : (
                        ''
                      )}
                      {article.dateRead ? (
                        <small>
                          {'Date Read: ' +
                            article.dateRead.toLocaleDateString()}
                          <br />
                        </small>
                      ) : (
                        ' '
                      )}
                      {article.projects
                        ? 'Projects: ' +
                          article.projects.map((t: string) => t + ' ').toJS()
                        : ' '}
                      <AddArticleToProject
                        id={article.id}
                        articleProjects={article.projects}
                      />
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
              {showImage && (
                <Col xs={4} sm={4} md={2} lg={2}>
                  <img
                    className="img-fluid img-thumbnail"
                    onTouchEnd={() =>
                      this.setState({
                        isMenuOpen: !this.state.isMenuOpen
                      })
                    }
                    src={article.metadata.get('images').get(0)}
                  />
                </Col>
              )}
            </Row>
          </Container>
        </LazyLoad>
      </ListGroupItem>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return ownProps;
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onArticleView: (articleID: string) => {
      dispatch(ArticleViewed(articleID));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
