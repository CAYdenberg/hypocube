import React from 'react';
import { Chart, LineSeries, list, XAxis, YAxis } from '../src';
import { bottomLine, topLine } from './__data__/spain-vax-timeline';

const COLORS = ['#003f5c', '#bc5090'];
const X_TICKS = list(15, (x) => x + 31);

const AreaChart: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  return (
    <Chart
      height={300}
      view={[31, 0, 15, 10]}
      gutter={[20, 20, 50, 50]}
      isCanvas={isCanvas}
    >
      <XAxis tickPositions={X_TICKS} />
      <YAxis tickPositions={[0, 5, 10]} />
      <LineSeries data={topLine} chartStyle={{ dataLineStroke: COLORS[0] }} />
      <LineSeries
        data={bottomLine}
        chartStyle={{ dataLineStroke: COLORS[1] }}
      />
    </Chart>
  );
};

export default AreaChart;
