import { scaleTime } from 'd3-scale';
import React from 'react';
import { Chart, Line, LineSeries, Point, XAxis, YAxis } from '../src';
import BarGraph from './BarGraph';
import ClickHandler from './ClickHandler';
import MultipleSeries from './MultipleSeries';
import { Pannable } from './Pannable';
import { canada } from './__data__/covid-canada';
import { rain } from './__data__/precipitation';
import { tickerTape } from './__data__/tickerTape';

interface Example {
  name: string;
  render: ({ isCanvas }: { isCanvas: boolean }) => JSX.Element;
}

const SimpleTooltip: React.FC = () => (
  <div
    style={{
      background: 'white',
      border: '1px solid black',
      boxShadow: '12px 12px 2px 1px rgba(0, 0, 255, 0.2)',
    }}
  >
    <strong>Hello, world!</strong>
  </div>
);

const examples: Example[] = [
  {
    name: 'Line',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        width={300}
        view={[-10, -10, 110, 110]}
        isCanvas={isCanvas}
      >
        <Line
          path={[
            [0, 0],
            [25, 75],
            [50, 0],
          ]}
        />
      </Chart>
    ),
  },
  {
    name: 'Filled line',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        width={300}
        view={[-10, -10, 110, 110]}
        isCanvas={isCanvas}
      >
        <Line
          path={[
            [0, 0],
            [25, 75],
            [50, 0],
          ]}
          fill="#000"
        />
      </Chart>
    ),
  },
  {
    name: 'Click handler',
    render: ({ isCanvas }) => <ClickHandler isCanvas={isCanvas} />,
  },
  {
    name: 'LineSeries',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        width={300}
        view={[0, 0, 1, 2.5]}
        gutter={[10, 10, 30, 50]}
        isCanvas={isCanvas}
        // tooltip={<SimpleTooltip />}
        // tooltipPosition={[10, 50]}
      >
        <XAxis range={[0, 1]} tickPositions={[0, 0.5, 1]} />
        <YAxis range={[0, 2.5]} tickPositions={[0, 0.5, 1, 1.5, 2, 2.5]} />
        <LineSeries
          data={tickerTape}
          color="#5477a1"
          styles={{ dataLineCurveType: 'natural', dataPointSymbol: 'circle' }}
        />
      </Chart>
    ),
  },
  {
    name: 'Bar Graph',
    render: ({ isCanvas }) => <BarGraph isCanvas={isCanvas} />,
  },
  {
    name: 'Pannable',
    render: ({ isCanvas }) => {
      const dates = canada.map((day) => new Date(day[0]));
      const scale = scaleTime(
        [dates[0], dates[dates.length - 1]],
        [0, dates.length]
      );
      const series: Array<[number, number]> = canada.map((day, i) => [
        scale(dates[i]),
        day[1],
      ]);

      return (
        <Pannable
          isCanvas={isCanvas}
          getDateLabel={(x) =>
            scale
              .invert(x)
              .getDate()
              .toString()
          }
          series={series}
          tickPositions={dates.map(scale)}
        />
      );
    },
  },
  {
    name: 'Multiple Series',
    render: ({ isCanvas }) => <MultipleSeries isCanvas={isCanvas} />,
  },
];

export default examples;
