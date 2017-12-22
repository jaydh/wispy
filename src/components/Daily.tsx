import * as React from 'react';
import { Button, Glyphicon, Collapse, ButtonGroup } from 'react-bootstrap';
import { Daily as DailyType } from '../constants/StoreState';
import {
  isSameDay,
  isBefore,
  subDays,
  differenceInCalendarDays
} from 'date-fns';

interface Props {
  onComplete: () => void;
  daily: DailyType;
  expand: boolean;
}

interface State {
  showDetails: boolean;
}

export default class Daily extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showDetails: props.expand };
  }
  render() {
    const { onComplete, daily, expand } = this.props;
    return (
      <ButtonGroup bsSize="small">
        <Button
          bsStyle="daily"
          disabled={isSameDay(daily.completedOn.last(), new Date())}
          onClick={() => onComplete()}
        >
          {daily.streakCount > 4 && (
            <b>
              {daily.streakCount}
              <Glyphicon glyph="fire" />{' '}
            </b>
          )}
          {daily.completedOn &&
            isBefore(daily.completedOn.last(), subDays(new Date(), 7)) && (
              <b>
                <Glyphicon glyph="warning-sign" />{' '}
              </b>
            )}
          {daily.title}
          <Collapse in={this.state.showDetails || expand}>
            <p>
              {daily.completedOn.last()
                ? 'Last Completed: ' +
                  daily.completedOn.last().toLocaleDateString()
                : ''}
              Completed {daily.completedOn.size} times <br />
              Started{' '}
              {differenceInCalendarDays(
                new Date(),
                daily.completedOn.first()
              )}{' '}
              days ago
            </p>
          </Collapse>
        </Button>
        <Button
          bsStyle="daily"
          active={this.state.showDetails}
          onClick={() =>
            this.state.showDetails || expand
              ? this.setState({ showDetails: false })
              : this.setState({ showDetails: true })
          }
        >
          <Glyphicon glyph="stats" />
        </Button>
      </ButtonGroup>
    );
  }
}
