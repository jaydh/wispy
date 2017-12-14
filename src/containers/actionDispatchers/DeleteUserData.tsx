import * as React from 'react';
import { connect } from 'react-redux';
import { deleteUserData } from '../../actions/deleteUserData';
import { Button, Glyphicon } from 'react-bootstrap';

interface Props {
  onDeleteClick: () => void;
}
interface State {
  locked: boolean;
}

class DeleteArticleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { locked: true };
  }

  toggleLock() {
    this.setState({ locked: !this.state.locked });
  }

  render() {
    return (
      <div>
        <Button bsSize="small" onClick={() => this.toggleLock()}>
          Toggle the dangerous button to the right
          <Glyphicon glyph="danger" />
        </Button>

        <Button
          bsSize="small"
          disabled={this.state.locked}
          onClick={() => this.props.onDeleteClick()}
        >
          Delete user data
          <Glyphicon glyph="danger" />
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    onDeleteClick: () => {
      dispatch(deleteUserData());
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteArticleList);