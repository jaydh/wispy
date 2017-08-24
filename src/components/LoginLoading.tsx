import * as React from 'react';
import { auth, provider } from '../firebase';
import { Button } from 'react-bootstrap';
export default class LoginLoading extends React.Component {
  render() {
    const wellStyles = { maxWidth: 400, margin: 'auto' };

    return (
      <div className="well" style={wellStyles}>
        <h2> Create account</h2>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={() => auth().signInWithRedirect(provider)}
          block={true}
        >
          Create with Google authentication
        </Button>
      </div>
    );
  }
}
