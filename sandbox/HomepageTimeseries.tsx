import React, { useCallback } from 'react';
import { DateTime } from 'luxon';
import {
  Chart,
  XAxis,
  LineSeries,
  GestureKind,
  YAxis,
  ChartEventData,
  ChartGestureData,
  Point,
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

const COLORS = ['#003f5c', '#58508d', '#bc5090'];

export interface DataPoint {
  series: string;
  coords: Point;
  xLabel: string;
  yLabel: string;
}

interface Props {
  isCanvas: boolean;
  selectedPoint?: DataPoint | null;
  handlePointSelect?: (data: DataPoint) => void;
  handleClearSelect?: () => void;
}

const HomepageTimeseries: React.FC<Props> = ({
  isCanvas,
  selectedPoint,
  handlePointSelect,
  handleClearSelect,
}) => {
  const [view, setView, scrollToView] = usePannable(
    [201, 0, 50, 250],
    [0, 0, 251, 250]
  );

  const onGesture = useCallback(
    (data: ChartGestureData) => {
      if (data.kind === GestureKind.Swipe) {
        scrollToView(data.nextView);
        return;
      }
      setView(data.nextView);
    },
    [setView, scrollToView]
  );

  const onPointerMove = useVoronoi(
    timeseriesData,
    useCallback(
      (data: ChartEventData) => {
        if (!handlePointSelect || !data.elementPosition) return;
        handlePointSelect({
          series: data.meta.seriesName as string,
          coords: data.elementPosition,
          xLabel: getTickLabel(data.elementPosition[0]),
          yLabel: String(data.elementPosition[1]),
        });
      },
      [handlePointSelect]
    )
  );

  const onPointerOut = useCallback(() => {
    handleClearSelect && handleClearSelect();
  }, [handleClearSelect]);

  return (
    <Chart
      height={300}
      width={435}
      view={view}
      gutter={[5, 20, 50, 60]}
      isCanvas={isCanvas}
      chartStyle={{
        dataPointSymbol: 'circle',
        dataLineCurveType: 'natural',
      }}
      onGesture={onGesture}
      onPointerOver={onPointerMove}
      onPointerOut={onPointerOut}
    >
      {timeseriesData.map(({ data, key }, i) => (
        <LineSeries
          key={key}
          data={data}
          handlerMeta={{ label: key }}
          chartStyle={{
            dataLineStroke: COLORS[i],
            dataPointFill: COLORS[i],
            seriesOpacity:
              selectedPoint && selectedPoint.series !== key ? 0.5 : 1,
          }}
        />
      ))}
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
