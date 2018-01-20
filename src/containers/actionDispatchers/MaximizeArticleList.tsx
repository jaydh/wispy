import * as React from 'react';
import { connect } from 'react-redux';
import {
  resizeArticleList,
  repositionArticleList
} from '../../actions/ui/articleList';
import { Button } from 'reactstrap';

export interface Props {
  onMaximizeClick: () => void;
}

class DeleteArticleList extends React.Component<Props, {}> {
  render() {
    const { onMaximizeClick } = this.props;
    return (
      <Button onClick={() => onMaximizeClick()} bsSize="small">
        DeleteArticleList
      </Button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onMaximizeClick: () => {
      dispatch(repositionArticleList(ownProps.id, 0, 0));
      dispatch(resizeArticleList(ownProps.id, -100000, -10000));
      dispatch(
        resizeArticleList(
          ownProps.id,
          window.innerWidth * 0.93,
          window.innerHeight * 0.93
        )
      );
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticleList);
