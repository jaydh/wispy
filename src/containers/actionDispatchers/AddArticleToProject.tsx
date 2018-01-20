import * as React from 'react';
import { connect } from 'react-redux';
import addArticleToProject from '../../actions/articles/addArticleToProject';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { List, Set } from 'immutable';
import { Project } from '../../constants/StoreState';

export interface Props {
  id: string;
  articleProjects: Set<string>;
  projects: List<string>;
  onAddToProject: (t: string, p: string) => void;
}

class AddArticleToProject extends React.Component<Props> {
  render() {
    const { onAddToProject, projects, articleProjects, id } = this.props;

    return (
      <UncontrolledDropdown size="sm">
        <DropdownToggle caret={true}>Add Article to Project</DropdownToggle>
        <DropdownMenu>
          {projects
            .filter((t: string) => {
              return !articleProjects.includes(t);
            })
            .map((t: string) => (
              <DropdownItem
                key={id + ' addProject ' + t}
                onClick={() => onAddToProject(id, t)}
              >
                {t}
              </DropdownItem>
            ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    projects: state
      .get('projects')
      .map((t: Project) => t.id)
      .toList()
      .sort()
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onAddToProject: (article: string, project: string) => {
      dispatch(addArticleToProject(article, project));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  AddArticleToProject
);
