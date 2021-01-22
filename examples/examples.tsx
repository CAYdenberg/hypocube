import React from 'react';
import { BarVerticalSeries, Chart, Handle, Line, XAxis, YAxis } from '../src';
import { bc as bcVaccinations } from './__data__/vaccinations';

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
        view={{ x: [-10, 100], y: [-10, 100] }}
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
        view={{ x: [-10, 100], y: [-10, 100] }}
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
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-10, 100], y: [-10, 100] }}
        isCanvas={isCanvas}
      >
        <Handle onClick={console.log} elementPosition={[0, 0]}>
          <Line
            path={[
              [0, 0],
              [25, 75],
              [50, 0],
            ]}
            fill="#000"
          />
        </Handle>
      </Chart>
    ),
  },
  {
    name: 'Scatter plot',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-10, 110], y: [-30, 110] }}
        isCanvas={isCanvas}
      >
        <XAxis range={[0, 100]} tickPositions={[0, 50, 100]} />
        <YAxis range={[0, 100]} tickPositions={[0, 25, 50, 75, 100]} />
      </Chart>
    ),
  },
  {
    name: 'B.C. COVID-19 Vaccinations',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={{ x: [-1, 7], y: [-100, 10000] }}
        isCanvas={isCanvas}
      >
        <XAxis range={[0, 6]} tickPositions={[0, 1, 2, 3, 4, 5, 6]} />
        <YAxis range={[0, 9000]} tickPositions={[0, 3000, 6000, 9000]} />
        <BarVerticalSeries
          data={bcVaccinations.map((point, i) => [i + 1, point[1]])}
          color="rgb(177, 0, 0)"
        />
      </Chart>
    ),
  },
];

export default examples;
