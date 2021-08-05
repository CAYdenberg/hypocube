import React from 'react';
import {
  Chart,
  XAxis,
  YAxis,
  LineSeries,
  Point,
  RangeVerticalSeries,
} from '../src';
import { rain } from './__data__/precipitationByCity';

const allData: Point[] = rain.reduce(
  (acc, series) => acc.concat(series.data),
  [] as Point[]
);

const distData = rain.map((series) => series.dist);

const DotAndTukey: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const getXLabel = (pos: number) => rain[pos].meta.seriesName;

  return (
    <Chart
      height={300}
      width={300}
      view={[-1, 0, 4, 200]}
      gutter={[20, 50, 50, 30]}
      isCanvas={isCanvas}
      chartStyle={{
        dataPointSymbol: 'circle',
        dataPointFill: '#077c3d',
        dataPointMinTargetRadius: 10,
      }}
    >
      <XAxis
        tickPositions={[0, 1, 2]}
        range={[-0.5, 2.5]}
        getTickLabel={getXLabel}
      />
      <YAxis
        tickPositions={[0, 50, 100, 150, 200]}
        getTickLabel={(pos) => String(pos)}
        intercept={-0.5}
      />
      <LineSeries data={allData} chartStyle={{ dataLineStrokeWidth: 0 }} />
      <RangeVerticalSeries
        data={distData}
        chartStyle={{
          dataRangeAnchorLength: 40,
        }}
      />
    </Chart>
  );
};

export default DotAndTukey;
