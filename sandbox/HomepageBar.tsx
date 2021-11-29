import React, { useCallback } from 'react';
import { DateTime } from 'luxon';

import {
  BarVerticalSeries,
  Chart,
  ChartEvent,
  ChartStyleFunction,
  RangeVerticalSeries,
  XAxis,
  YAxis,
  getSeriesOffsets,
} from '../src';
import byMonthSeries, { ByMonth } from './__data__/homepage-2';
import { DataPoint } from './HomepageTimeseries';

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

const barWidth: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 600 ? 6 : 10;
const barOffsets = getSeriesOffsets(barWidth, 3);
const capWidth: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 600 ? 0 : 6;
const fontSize: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 600 ? 12 : 16;

interface Props {
  isCanvas: boolean;
  colors: Record<string, string>;
  selectedPoint?: DataPoint | null;
  handlePointSelect?: (data: DataPoint) => void;
  handleClearSelect?: () => void;
}

const HomepageBar: React.FC<Props> = ({
  isCanvas,
  colors,
  selectedPoint,
  handlePointSelect,
  handleClearSelect,
}) => {
  const onPointerOver = useCallback(
    (data: ChartEvent) => {
      if (!handlePointSelect || !data.elementPosition) return;
      handlePointSelect({
        series: data.meta.seriesName as string,
        coords: data.elementPosition,
        xLabel: getTickLabel(data.elementPosition[0]),
        yLabel: data.elementPosition[1].toFixed(1),
      });
    },
    [handlePointSelect]
  );

  const onPointerOut = useCallback(() => {
    handleClearSelect && handleClearSelect();
  }, [handleClearSelect]);

  return (
    <Chart
      height={300}
      ssWidth={435}
      view={[-0.5, 0, 12, 250]}
      gutter={[0, 0, 50, 60]}
      isCanvas={isCanvas}
      chartStyle={{
        dataWhiskerTopCapLength: capWidth,
        dataWhiskerBottomCapLength: capWidth,
        dataWhiskerStroke: '#464f58',
        dataBoxThickness: barWidth,
        fontSize,
      }}
      onPointerOut={onPointerOut}
    >
      <XAxis tickPositions={ticks} getTickLabel={getTickLabel} />
      <YAxis
        tickPositions={[0, 100, 200]}
        intercept={-0.5}
        axisLabel="Precipitation (mm)"
      />
      {byMonthSeries.map(({ data, key }, i) => (
        <React.Fragment key={key}>
          <BarVerticalSeries
            data={data}
            chartStyle={{
              dataBoxFill: colors[key],
              seriesXOffset: barOffsets[i],
              seriesOpacity:
                selectedPoint && selectedPoint.series !== key ? 0.5 : 1,
            }}
            handlerMeta={{ seriesName: key }}
            onPointerOver={onPointerOver}
          />
          <RangeVerticalSeries
            data={getRanges(byMonthSeries[i])}
            chartStyle={{
              seriesXOffset: barOffsets[i],
              seriesOpacity:
                selectedPoint && selectedPoint.series !== key ? 0.5 : 1,
            }}
          />
        </React.Fragment>
      ))}
    </Chart>
  );
};

export default HomepageBar;
