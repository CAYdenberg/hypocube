import React, { useCallback } from 'react';
import { DateTime } from 'luxon';
import {
  Chart,
  XAxis,
  LineSeries,
  YAxis,
  ChartEventData,
  Point,
  ChartStyleFunction,
} from '../src';
import usePannable from '../src/addons/usePannable';
import timeseriesData, { labels } from './__data__/homepage-1';
import useVoronoi from '../src/addons/useVoronoi';

const ticks = ({ pxWidth }: { pxWidth: number }) => {
  const interval = pxWidth > 768 ? 6 : 12;
  return labels
    .map((_, i) => (i % interval ? null : i))
    .filter((val) => val !== null) as number[];
};

const getTickLabel = (x: number) => {
  const raw = labels[x];
  const dt = DateTime.fromISO(raw);
  return dt.toLocaleString({ year: 'numeric', month: 'short' });
};

const getFontSize: ChartStyleFunction<number> = ({ pxWidth }) =>
  pxWidth < 500 ? 12 : 16;

export interface DataPoint {
  series: string;
  coords: Point;
  xLabel: string;
  yLabel: string;
}

interface Props {
  isCanvas: boolean;
  colors: Record<string, string>;
  selectedPoint?: DataPoint | null;
  handlePointSelect?: (data: DataPoint) => void;
  handleClearSelect?: () => void;
}

const bounds: [number, number, number, number] = [0, 0, 251, 250];

const HomepageTimeseriesData: React.FC<{
  selected: DataPoint | null | undefined;
  colors: Record<string, string>;
}> = ({ selected, colors }) => (
  <React.Fragment>
    {timeseriesData.map(({ data, key }) => (
      <LineSeries
        key={key}
        data={data}
        chartStyle={{
          dataLineStroke: colors[key],
          dataPointFill: colors[key],
          seriesOpacity: selected && selected.series !== key ? 0.5 : 1,
        }}
      />
    ))}
  </React.Fragment>
);

const HomepageTimeseries: React.FC<Props> = ({
  isCanvas,
  colors,
  selectedPoint,
  handlePointSelect,
  handleClearSelect,
}) => {
  const { state: view, onGesture, isPanning } = usePannable([201, 0, 50, 250], {
    bounds,
  });

  const onPointerMove = useVoronoi(
    timeseriesData,
    useCallback(
      (data: ChartEventData) => {
        if (!handlePointSelect || !data.elementPosition || isPanning) return;
        handlePointSelect({
          series: data.meta.seriesName as string,
          coords: data.elementPosition,
          xLabel: getTickLabel(data.elementPosition[0]),
          yLabel: String(data.elementPosition[1]),
        });
      },
      [handlePointSelect, isPanning]
    )
  );

  const onPointerOut = useCallback(() => {
    handleClearSelect && handleClearSelect();
  }, [handleClearSelect]);

  return (
    <Chart
      height={300}
      ssWidth={435}
      view={view}
      gutter={[5, 20, 50, 60]}
      isCanvas={isCanvas}
      chartStyle={{
        dataPointSymbol: 'circle',
        dataLineCurveType: 'natural',
        fontSize: getFontSize,
        svgPointerEvents: false,
      }}
      onGesture={onGesture}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    >
      <HomepageTimeseriesData colors={colors} selected={selectedPoint} />
      {selectedPoint && (
        <LineSeries
          data={[selectedPoint.coords]}
          chartStyle={{
            dataPointFill: '#1ed3c6',
            dataPointSize: 30,
            seriesOpacity: 0.6,
          }}
        />
      )}
      <XAxis tickPositions={ticks} getTickLabel={getTickLabel} />
      <YAxis
        tickPositions={[0, 100, 200]}
        getTickLabel={(pos) => String(pos)}
        intercept={view.xMin}
        axisLabel="Precipitation (mm)"
      />
    </Chart>
  );
};

export default HomepageTimeseries;
