import { scaleTime } from 'd3-scale';
import React from 'react';
import {
  BarVerticalSeries,
  Chart,
  Line,
  LineSeries,
  ScatterSeries,
  XAxis,
  YAxis,
} from '../src';
import ClickHandler from './ClickHandler';
import { Pannable } from './Pannable';
import { canada } from './__data__/covid-canada';
import { tickerTape } from './__data__/tickerTape';
import { bc as bcVaccinations } from './__data__/vaccinations';

interface Example {
  name: string;
  render: ({ isCanvas }: { isCanvas: boolean }) => JSX.Element;
}

// const SimpleTooltip: React.FC = () => (
//   <div
//     style={{
//       background: 'white',
//       border: '1px solid black',
//       boxShadow: '12px 12px 2px 1px rgba(0, 0, 255, 0.2)',
//     }}
//   >
//     <strong>Hello, world!</strong>
//   </div>
// );

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
    name: 'Scatter plot',
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
        <ScatterSeries data={tickerTape} color="#5477a1" />
        <LineSeries
          data={tickerTape}
          color="#5477a1"
          overrideStyles={{ dataLineCurveType: 'natural' }}
        />
      </Chart>
    ),
  },
  {
    name: 'B.C. COVID-19 Vaccinations - Bar',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        width={300}
        view={[0, 0, 6, 9000]}
        gutter={[20, 20, 50, 50]}
        isCanvas={isCanvas}
      >
        <XAxis
          range={[0, 6]}
          tickPositions={[1, 2, 3, 4, 5, 6]}
          getTickLabel={(x) => bcVaccinations[x - 1][0]}
        />
        <YAxis range={[0, 9000]} tickPositions={[0, 3000, 6000, 9000]} />
        <BarVerticalSeries
          data={bcVaccinations.map((point, i) => [i + 1, point[1]])}
          color="rgb(177, 0, 0)"
        />
      </Chart>
    ),
  },
  {
    name: 'Canada COVID-19 Cases',
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
];

export default examples;
