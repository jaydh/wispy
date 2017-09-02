import Canvas from '../components/Canvas';
import { connect } from 'react-redux';
import { ListenToFirebase } from '../actions/syncWithFirebase';
import { addArticleList } from '../actions/articleList';

const mapDispatchToProps = (dispatch: any) => {
  return {
    AddArticleList: () => {
      dispatch(addArticleList());
    },
    ListenToFirebase: () => {
      dispatch(ListenToFirebase());
    }
  };
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    articleLists: state.get('articleLists')
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
