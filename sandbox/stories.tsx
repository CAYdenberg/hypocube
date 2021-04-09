import { scaleTime } from 'd3-scale';
import React from 'react';
import { Chart, Line, LineSeries, XAxis, YAxis } from '../src';
import BarGraph from './BarGraph';
import ClickHandler from './ClickHandler';
import MultipleSeries from './MultipleSeries';
import { Pannable } from './Pannable';
import { canada } from './__data__/covid-canada';
import { tickerTape } from './__data__/tickerTape';

interface Example {
  name: string;
  render: ({ isCanvas }: { isCanvas: boolean }) => JSX.Element;
}

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
      const series: Array<[number, number]> = canada.map((day, i) => [
        i,
        day[1],
      ]);

      return (
        <Pannable
          isCanvas={isCanvas}
          getDateLabel={(x) => canada[x][0]}
          series={series}
          tickPositions={canada.map((_, i) => i)}
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
