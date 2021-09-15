import React from 'react';
import { DateTime } from 'luxon';

import {
  BarVerticalSeries,
  Chart,
  RangeVerticalSeries,
  XAxis,
  YAxis,
} from '../src';
import { getBarOffsets } from '../src/addons/seriesStyle';
import byMonthSeries, { ByMonth } from './__data__/homepage-2';

const ticks = Array.from({ length: 12 }, (_, i) => i);
const getTickLabel = (x: number) => {
  const dt = DateTime.local(2020, x + 1);
  return dt.toLocaleString({ month: 'short' });
};
const getRanges = (series: ByMonth) =>
  series.data.map((datapoint, i) => {
    const errorpoint = series.error[i];
    return {
      anchor: datapoint,
      ranges: [datapoint[1] - errorpoint[1], datapoint[1] + errorpoint[1]],
    };
  });

const COLORS = ['#003f5c', '#58508d', '#bc5090'];
const barOffsets = getBarOffsets(10, 3);

const HomepageBar: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  return (
    <Chart
      height={300}
      width={435}
      view={[-0.5, 0, 12, 200]}
      gutter={[50, 0, 50, 50]}
      isCanvas={isCanvas}
    >
      <XAxis tickPositions={ticks} getTickLabel={getTickLabel} />
      <YAxis range={[0, 200]} tickPositions={[0, 100, 200]} intercept={-0.5} />
      {byMonthSeries.map(({ data, key }, i) => (
        <React.Fragment key={key}>
          <BarVerticalSeries
            data={data}
            chartStyle={{
              dataBoxFill: COLORS[i],
              seriesXOffset: barOffsets[i],
            }}
          />
          <RangeVerticalSeries
            data={getRanges(byMonthSeries[i])}
            chartStyle={{ seriesXOffset: barOffsets[i] }}
          />
        </React.Fragment>
      ))}
    </Chart>
  );
};

export default HomepageBar;
