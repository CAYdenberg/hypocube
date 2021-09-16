import React, { useCallback } from 'react';
import { DateTime } from 'luxon';

import {
  BarVerticalSeries,
  Chart,
  ChartEventData,
  ChartStyleFunction,
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
const barWidth: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 600 ? 6 : 10;
const barOffsets = getBarOffsets(barWidth, 3);
const capWidth: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 600 ? 0 : 6;
const fontSize: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 600 ? 12 : 16;

interface Props {
  isCanvas: boolean;
  handlePointSelect?: (data: { series: string; x: string; y: string }) => void;
  handleClearSelect?: () => void;
}

const HomepageBar: React.FC<Props> = ({
  isCanvas,
  handlePointSelect,
  handleClearSelect,
}) => {
  const onPointerOver = useCallback(
    (data: ChartEventData) => {
      if (!handlePointSelect || !data.elementPosition) return;
      handlePointSelect({
        series: data.meta.seriesName as string,
        x: getTickLabel(data.elementPosition[0]),
        y: data.elementPosition[1].toFixed(1),
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
      width={435}
      view={[-0.5, 0, 12, 200]}
      gutter={[50, 0, 50, 60]}
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
        range={[0, 200]}
        tickPositions={[0, 100, 200]}
        intercept={-0.5}
        axisLabel="Precipitation (mm)"
      />
      {byMonthSeries.map(({ data, key }, i) => (
        <React.Fragment key={key}>
          <BarVerticalSeries
            data={data}
            chartStyle={{
              dataBoxFill: COLORS[i],
              seriesXOffset: barOffsets[i],
            }}
            handlerMeta={{ seriesName: key }}
            onPointerOver={onPointerOver}
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
