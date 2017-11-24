import * as React from 'react';
import { connect } from 'react-redux';
import { Scatter } from 'react-chartjs-2';
import { List } from 'immutable';
import { Daily } from '../../constants/StoreState';
import { isAfter, subWeeks, differenceInCalendarDays } from 'date-fns';

let Colors = List([
  '#7F7EFF',
  '#ED254E',
  '#7D4E57',
  '#EF798A',
  '#CCFBFE',
  '#8D6A9F',
  '#00A9A5',
  '#C4F1BE',
  '#E36397',
  '#577399',
  '#1B998B'
]);

interface Props {
  dailies: List<Daily>;
}

interface State {
  colors: List<string>;
}
class DailyGraph extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      colors: this.props.dailies
        .map((t: any) => {
          const color = this.dynamicColors();
          return color;
        })
        .toList()
    };
  }
  dynamicColors = function() {
    return Colors.get(Math.floor(Math.random() * Colors.size));
  };

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      colors: nextProps.dailies
        .map((t: any) => {
          const color = this.dynamicColors();
          return color;
        })
        .toList()
    });
  }
  render() {
    const { dailies } = this.props;
    const data = {
      datasets: dailies
        .map((t: Daily, key: number) => {
          const color = this.state.colors.get(key);
          return {
            data: t.completedOn
              ? t.completedOn
                  .filter((p: Date) => isAfter(p, subWeeks(new Date(), 4)))
                  .map((p: Date) => {
                    return {
                      t: p,
                      y: t.title
                    };
                  })
                  .toJS()
              : [],
            backgroundColor: color,
            pointStyle: 'rectRot',
            radius: 8,
            label:
              t.title +
              ' ' +
              (isAfter(subWeeks(new Date(), 3), t.completedOn.first())
                ? (t.completedOn.filter((p: Date) =>
                    isAfter(p, subWeeks(new Date(), 3))
                  ).size /
                    21 *
                    100
                  ).toFixed(0)
                : (t.completedOn.size /
                    differenceInCalendarDays(
                      new Date(),
                      t.completedOn.first()
                    ) *
                    100
                  ).toFixed(0)) +
              '%'
          };
        })
        .sort()
        .toJS()
    };
    const options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            type: 'category',
            ticks: {
              source: 'labels',
              fontColor: '#ffffff'
            },
            labels: dailies.map((t: Daily) => t.title).toJS(),
            gridLines: {
              display: true,
              drawBorder: false,
              color: '#f2b632'
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            gridLines: {
              display: true,
              color: '#f2b632'
            },
            ticks: {
              callback: function(tick: any, index: any, array: any) {
                return index % 7 ? '' : tick;
              },
              fontColor: '#ffffff'
            },

            time: {
              max: new Date(),
              round: 'day',
              unit: 'day',
              stepSize: 1,
              displayFormats: {
                millisecond: 'MMM DD',
                second: 'MMM DD',
                minute: 'MMM DD',
                hour: 'MMM DD',
                day: 'MMM DD',
                week: 'MMM DD',
                month: 'MMM DD',
                quarter: 'MMM DD',
                year: 'MMM DD'
              }
            }
          }
        ]
      },
      title: {
        display: true,
        text: 'Dailies completed'
      },
      legend: {
        display: true,
        position: 'right'
      },
      tooltips: {
        callbacks: {
          label: function(t: any, d: any) {
            return '(Date:' + t.xLabel + ')';
          }
        }
      }
    } as any;

    return <Scatter data={data} options={options} />;
  }
}
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    dailies: state.get('dailies')
  };
};

export default connect(mapStateToProps)(DailyGraph);
