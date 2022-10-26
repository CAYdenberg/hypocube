import React from 'react';
import {
  Chart,
  Clip,
  Line,
  Text,
  LineSeries,
  XAxis,
  YAxis,
  Symbol,
} from '../src';
import ChartError from '../src/components/base/ChartError';
import BarGraph from './BarGraph';
import ClickHandler from './ClickHandler';
import MultipleBarGraph from './MultipleBarGraph';
import MultipleSeries from './MultipleSeries';
import Pannable from './Pannable';
import DotAndTukey from './DotAndTukey';
import HomepageTimeseries from './HomepageTimeseries';
import HomepageBar from './HomepageBar';
import { canada } from './__data__/covid-canada';
import { tickerTape } from './__data__/tickerTape';
import GestureDemo from './GestureDemo';
import AreaChart from './AreaChart';
import AnimationDemo from './AnimationDemo';

interface Example {
  name: string;
  render: ({ isCanvas }: { isCanvas: boolean }) => JSX.Element;
}

const examples: Example[] = [
  {
    name: 'Line',
    render: ({ isCanvas }) => (
      <Chart height={300} view={[-10, -10, 110, 110]} isCanvas={isCanvas}>
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
      <Chart height={300} view={[-10, -10, 110, 110]} isCanvas={isCanvas}>
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
    name: 'Line with clip',
    render: ({ isCanvas }) => (
      <Chart height={300} view={[-10, -10, 110, 110]} isCanvas={isCanvas}>
        <Clip
          path={[
            [0, 0],
            [50, 0],
            [50, 50],
            [0, 50],
          ]}
        >
          <Line
            path={[
              [0, 0],
              [25, 75],
              [50, 0],
            ]}
            fill="#000"
          />
        </Clip>
      </Chart>
    ),
  },
  {
    name: 'Multiple clip',
    render: ({ isCanvas }) => (
      <Chart height={300} view={[-10, -10, 110, 110]} isCanvas={isCanvas}>
        <Clip
          path={[
            [0, 0],
            [50, 0],
            [50, 50],
            [0, 50],
          ]}
        >
          <Clip
            path={[
              [25, 75],
              [25, 0],
              [50, 0],
              [50, 75],
            ]}
          >
            <Line
              path={[
                [0, 0],
                [25, 75],
                [50, 0],
              ]}
              fill="#000"
            />
          </Clip>
        </Clip>
      </Chart>
    ),
  },
  {
    name: 'Text rotation',
    render: ({ isCanvas }) => (
      <Chart height={300} view={[0, 0, 5, 2]} isCanvas={isCanvas}>
        <Line
          path={[
            [0, 1],
            [5, 1],
          ]}
          dash="dashed"
        />
        {[1, 2, 3, 4].map((x) => (
          <React.Fragment key={x}>
            <Line
              path={[
                [x, 0],
                [x, 2],
              ]}
              dash="dashed"
            />
            <Text
              position={[x, 1]}
              text="Lazy bog"
              align="center"
              rotation={-0.5 * x * Math.PI}
            />
          </React.Fragment>
        ))}
      </Chart>
    ),
  },
  {
    name: 'Symbol rotation',
    render: ({ isCanvas }) => (
      <Chart height={300} view={[0, 0, 5, 2]} isCanvas={isCanvas}>
        <Line
          path={[
            [0, 1],
            [5, 1],
          ]}
          dash="dashed"
        />
        {[1, 2, 3, 4].map((x) => (
          <React.Fragment key={x}>
            <Line
              path={[
                [x, 0],
                [x, 2],
              ]}
              dash="dashed"
            />
            <Symbol
              point={[x, 1]}
              symbol="triangle"
              size={50}
              rotation={0.5 * x * Math.PI}
            />
          </React.Fragment>
        ))}
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
          chartStyle={{
            dataLineCurveType: 'natural',
            dataPointSymbol: 'circle',
            dataLineStroke: '#5477a1',
            dataPointFill: '#5477a1',
          }}
        />
      </Chart>
    ),
  },
  {
    name: 'Mixed axis labels',
    render: ({ isCanvas }) => (
      <Chart
        height={300}
        view={[0, 0, 1, 2.5]}
        gutter={[10, 10, 30, 50]}
        isCanvas={isCanvas}
      >
        <XAxis
          range={[0, 1]}
          tickPositions={[0, [0.5, 'fizz'], 1]}
          getTickLabel={(pos) => String(pos + 1)}
        />
        <YAxis
          range={[0, 2.5]}
          tickPositions={[0, [0.5, 'half'], 1, [1.5, 'fizz'], 2, [2.5, 'buzz']]}
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
  {
    name: 'Area Chart',
    render: ({ isCanvas }) => <AreaChart isCanvas={isCanvas} />,
  },
  {
    name: 'Multiple Bar Series',
    render: ({ isCanvas }) => <MultipleBarGraph isCanvas={isCanvas} />,
  },
  {
    name: 'Dot and Tukey plot',
    render: ({ isCanvas }) => <DotAndTukey isCanvas={isCanvas} />,
  },
  {
    name: 'Rendering error',
    render: ({ isCanvas }) => (
      <ChartError isCanvas={isCanvas} height={300} view={[0, 0, 0, 0]}>
        <XAxis />
      </ChartError>
    ),
  },
  {
    name: 'Homepage: Timeseries',
    render: ({ isCanvas }) => {
      return (
        <HomepageTimeseries
          isCanvas={isCanvas}
          colors={
            {
              Vancouver: '#003f5c',
              Victoria: '#58508d',
              Kelowna: '#bc5090',
            } as Record<string, string>
          }
        />
      );
    },
  },
  {
    name: 'Homepage: Bar',
    render: ({ isCanvas }) => {
      return (
        <HomepageBar
          isCanvas={isCanvas}
          colors={
            {
              Vancouver: '#003f5c',
              Victoria: '#58508d',
              Kelowna: '#bc5090',
            } as Record<string, string>
          }
        />
      );
    },
  },
  {
    name: 'Gesture Demo',
    render: ({ isCanvas }) => <GestureDemo isCanvas={isCanvas} />,
  },
  {
    name: 'Animation Demo',
    render: ({ isCanvas }) => <AnimationDemo isCanvas={isCanvas} />,
  },
];

export default examples;
