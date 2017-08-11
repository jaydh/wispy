import * as React from 'react';
import Logout from './Logout';
import {  PageHeader } from 'react-bootstrap';
import '!!style-loader!css-loader!../css/creative.min.css';
import 'whatwg-fetch';
import { List } from 'immutable';
import Canvas from '../containers/Canvas';

interface State {
  gitCommit: string;
  articleListIDs: List<number>;
}

class App extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = {
      gitCommit: 'not available',
      articleListIDs: List([0])
    };
  }

  addListClick() {
    this.setState({
      articleListIDs: this.state.articleListIDs.push(this.state.articleListIDs.size)
    });
  }

  // Gets repository information
  componentWillMount() {
    let that = this;
    fetch('https://api.github.com/repos/jaydh/wispy')
      .then(function (response: any) {
        return response.json();
      })
      .then(function (json: any) {
        that.setState({ gitCommit: json.updated_at });
      })
      .catch(function (ex: any) {
        console.log('parsing failed', ex);
      });
  }

  public render() {
    const gitDate = new Date(this.state.gitCommit);
    return (
      <div className="container">
        <PageHeader>
          wispy
        </PageHeader>
        <Canvas/>
        <Logout />
        <p>
          Under active development <br />
          Last updated: {gitDate.toLocaleString()} <br />
          Github Repo: <a>https://github.com/jaydh/wispy</a>
        </p>
      </div>
    );
  }
}

export default App;
