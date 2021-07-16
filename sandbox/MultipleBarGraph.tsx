import React from 'react';
import { BarVerticalSeries, Chart, Point, XAxis, YAxis } from '../src';
import applySeriesStyles from '../src/addons/applySeriesStyles';
import { bc as bcVaccinations } from './__data__/vaccinations';

const MultipleBarGraph: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const getXLabel = (x: number) => bcVaccinations[x - 1][0];

  const bars = bcVaccinations.map((point, i) => [i + 1, point[1]]) as Point[];
  const control = bars.slice();

  return (
    <React.Fragment>
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
          getTickLabel={getXLabel}
        />
        <YAxis range={[0, 9000]} tickPositions={[0, 3000, 6000, 9000]} />
        {applySeriesStyles([bars, control], {
          xOffsets: true,
          colors: ['rgb(177, 0, 0)', 'rgb(150, 150, 150)'],
        }).map(({ data, chartStyle }, i) => (
          <BarVerticalSeries data={data} chartStyle={chartStyle} key={i} />
        ))}
      </Chart>
    </React.Fragment>
  );
};

export default MultipleBarGraph;
