import * as React from 'react';
import { connect } from 'react-redux';
import { deleteArticleList } from '../../actions/articleList';
import { Glyphicon } from 'react-bootstrap';

export interface Props {
  onDeleteClick: () => void;
}

class DeleteArticleList extends React.Component<Props, {}> {
  render() {
    const { onDeleteClick } = this.props;
    return (
      <button
        type="button"
        onClick={() => onDeleteClick()}
        className="close"
        aria-label="Close"
        style={{ position: 'absolute', top: '1em', right: '1em' }}
      >
        <Glyphicon glyph="remove" />
      </button>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onDeleteClick: () => {
      dispatch(deleteArticleList(ownProps.id));
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticleList);