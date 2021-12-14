import React from 'react';
import {
  Chart,
  XAxis,
  YAxis,
  RangeVerticalSeries,
  DataRangeVertical,
  DataBoxVertical,
} from '../../src';
import { rain } from '../__data__/precipitationByCity';

const distData = rain.map(
  (series) => [series.dist.anchor[0], series.dist.ranges] as [number, number[]]
);

const CoreConceptsDemo: React.FC<{
  isCanvas: boolean;
  reduceInk?: boolean;
}> = ({ isCanvas, reduceInk }) => {
  return (
    <Chart
      ssWidth={150}
      height={(width) => (width > 250 ? 250 : width)}
      view={[-1, 0, 4, 250]}
      gutter={[10, 0, 10, 10]}
      isCanvas={isCanvas}
      chartStyle={{
        fontSize: 15,
        axisTickLength: 15,
        dataBoxFill: '',
        dataBoxStroke: reduceInk ? '#666' : '#000',
        dataBoxStrokeWidth: reduceInk ? 1 : 2,
        dataBoxThickness: reduceInk ? 4 : 20,
        dataRangeCapLength: reduceInk ? 4 : 20,
      }}
    >
      <XAxis range={[-0.5, 2.5]} />
      <YAxis
        tickPositions={[0, 50, 100, 150, 200, 250]}
        getTickLabel={() => ''}
        intercept={-0.5}
      />
      <RangeVerticalSeries
        data={distData}
        renderRanges={[
          DataRangeVertical,
          DataBoxVertical,
          DataBoxVertical,
          DataRangeVertical,
        ]}
      />
    </Chart>
  );
};

export default CoreConceptsDemo;
