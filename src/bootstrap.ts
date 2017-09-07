import { Button,ButtonGroup, Jumbotron } from 'react-bootstrap';
const { bootstrapUtils } = require('react-bootstrap/lib/utils');

export default () => {
  bootstrapUtils.addStyle(Button, 'more');
  bootstrapUtils.addStyle(Button, 'addList');
  bootstrapUtils.addStyle(Button, 'analytics');  
  bootstrapUtils.addStyle(Button, 'drag');
  bootstrapUtils.addStyle(Button, 'submit');
  bootstrapUtils.addStyle(Button, 'logout');  
  bootstrapUtils.addStyle(Jumbotron, 'canvas');
  bootstrapUtils.addStyle(ButtonGroup, 'article');
  
};
