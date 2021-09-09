import React from 'react';
import {
  Chart,
  XAxis,
  LineSeries,
  GestureKind,
  ChartStyleOptions,
  YAxis,
} from '../src';
import applySeriesStyles from '../src/addons/applySeriesStyles';
import timeseriesData from './__data__/homepage-1';

const HomepageTimeseries: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  return (
    <Chart
      height={300}
      width={300}
      view={[201, 0, 50, 250]}
      gutter={[5, 20, 50, 50]}
      isCanvas={isCanvas}
      chartStyle={{
        dataPointSymbol: 'circle',
        dataLineCurveType: 'natural',
      }}
    >
      {applySeriesStyles(timeseriesData, {
        colors: ['#003f5c', '#58508d', '#bc5090'],
      }).map(({ data, key, chartStyle }) => (
        <LineSeries
          key={key}
          data={data}
          handlerMeta={{ label: key }}
          chartStyle={chartStyle}
        />
      ))}
      <XAxis />
      <YAxis
        tickPositions={[0, 100, 200]}
        getTickLabel={(pos) => String(pos)}
        intercept={201}
      />
    </Chart>
  );
};

export default HomepageTimeseries;
