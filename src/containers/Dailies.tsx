import * as React from 'react';
import {
  Jumbotron,
  Button,
  ButtonGroup,
  Collapse,
  Glyphicon
} from 'react-bootstrap';
import { connect } from 'react-redux';
import completeDaily from '../actions/dailies/completeDaily';
import { Daily } from '../constants/StoreState';
import { List } from 'immutable';
import DailyGraph from './graphs/DailyGraph';
import { isBefore, subDays } from 'date-fns';
import * as moment from 'moment';

interface Props {
  onComplete: (id: string) => void;
  AddDaily: (daily: string) => void;
  dailies: List<Daily>;
}

interface State {
  graphOpen: boolean;
}

class Dailies extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { graphOpen: false };
  }

  render() {
    const { onComplete, dailies } = this.props;
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({ graphOpen: !this.state.graphOpen });
          }}
        >
          <Glyphicon glyph="stats" />
        </Button>

        <Jumbotron className="daily-canvas">
          <ButtonGroup>
            {dailies
              .filter((t: Daily) => {
                return t.completedOn && !t.completedOn.isEmpty()
                  ? !moment(t.completedOn.last()).isSame(moment(), 'day')
                  : true;
              })
              .map((t: Daily) => {
                return (
                  <Button
                    bsStyle="daily"
                    key={t.id}
                    onClick={() => onComplete(t.id)}
                  >
                    {t.streakCount > 4 && (
                      <b>
                        {t.streakCount}
                        <Glyphicon glyph="fire" />{' '}
                      </b>
                    )}
                    {isBefore(t.completedOn.last(), subDays(new Date(), 7)) && (
                      <b>
                        <Glyphicon glyph="warning-sign" />{' '}
                      </b>
                    )}
                    {t.title}
                  </Button>
                );
              })}
          </ButtonGroup>
          {this.state.graphOpen && (
            <Collapse in={this.state.graphOpen}>
              <DailyGraph />
            </Collapse>
          )}
        </Jumbotron>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    dailies: state.get('dailies')
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onComplete: (id: string) => {
      dispatch(completeDaily(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dailies);
