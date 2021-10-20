import React from 'react';
import { BarVerticalSeries, Chart, Point, XAxis, YAxis } from '../src';
import { getSeriesOffsets } from '../src/api/seriesStyle';
import { bc as bcVaccinations } from './__data__/vaccinations';

const COLORS = ['rgb(177, 0, 0)', 'rgb(150, 150, 150)'];
const barOffsets = getSeriesOffsets(10, 2);

const MultipleBarGraph: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const getXLabel = (x: number) => bcVaccinations[x - 1][0];

  const bars = {
    key: 'Bars',
    data: bcVaccinations.map((point, i) => [i + 1, point[1]]) as Point[],
  };
  const control = {
    key: 'Control',
    data: bars.data.slice(),
  };

  return (
    <Chart
      height={300}
      view={[0, 0, 6, 9000]}
      gutter={[20, 20, 50, 50]}
      isCanvas={isCanvas}
    >
      <XAxis
        range={[0, 6]}
        tickPositions={[1, 2, 3, 4, 5, 6]}
        getTickLabel={getXLabel}
      />
      <YAxis range={[0, 9000]} tickPositions={[0, 3000, 6000, 9000]} />
      {[bars, control].map(({ data, key }, i) => (
        <BarVerticalSeries
          data={data}
          chartStyle={{ dataBoxFill: COLORS[i], seriesXOffset: barOffsets[i] }}
          key={key}
        />
      ))}
    </Chart>
  );
};

export default MultipleBarGraph;
