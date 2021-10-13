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
import { ZoomControlsContainer, ZoomControl } from './resources/ZoomControls';
import {
  ChevronDoubleRightIcon,
  ZoomOutIcon,
  ZoomInIcon,
} from './resources/icons';

const ticks = labels.map((_, i) => i);

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
const initial: [number, number, number, number] = [201, 0, 50, 250];
const maxZoomX = 12;
const maxZoomY = 250;

const HomepageTimeseries: React.FC<Props> = ({
  isCanvas,
  colors,
  selectedPoint,
  handlePointSelect,
  handleClearSelect,
}) => {
  const { view, scrollToView, onGesture, isPanning, can } = usePannable(
    [201, 0, 50, 250],
    {
      bounds,
      maxZoomX,
      maxZoomY,
    }
  );

  const handleSelectPoint = useCallback(
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
  );

  return (
    <React.Fragment>
      <ZoomControlsContainer>
        <ZoomControl
          icon={<ZoomOutIcon />}
          text="Zoom Out"
          isDisabled={!can.zoomOut}
          onClick={() => scrollToView(view.zoom(0.5))}
        />
        <ZoomControl
          icon={<ZoomInIcon />}
          text="Zoom In"
          isDisabled={!can.zoomIn}
          onClick={() => scrollToView(view.zoom(2))}
        />
        <ZoomControl
          icon={<ChevronDoubleRightIcon />}
          text="Current"
          isDisabled={!can.panRight}
          onClick={() => scrollToView(initial)}
        />
      </ZoomControlsContainer>
      <div className="hp-timeseries-wrapper">
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
          }}
          onGesture={onGesture}
          onPointerOut={handleClearSelect}
        >
          {timeseriesData.map(({ data, meta, key }) => (
            <LineSeries
              key={key}
              data={data}
              chartStyle={{
                dataLineStroke: colors[key],
                dataPointFill: colors[key],
                seriesOpacity:
                  selectedPoint && selectedPoint.series !== key ? 0.5 : 1,
                dataPointMinTargetRadius: 10,
              }}
              onPointerMove={handleSelectPoint}
              onPointerDown={handleSelectPoint}
              handlerMeta={{ seriesName: meta.seriesName }}
            />
          ))}
          {selectedPoint && (
            <LineSeries
              data={[selectedPoint.coords]}
              chartStyle={{
                dataPointFill: '#1ed3c6',
                dataPointSize: 30,
                seriesOpacity: 0.6,
                svgPointerEvents: false,
              }}
            />
          )}
          <XAxis
            tickPositions={ticks}
            getTickLabel={getTickLabel}
            chartStyle={{
              axisTickModulus: ({ pxWidth, view }) => {
                const pxPerTick = pxWidth / view.width;
                return pxPerTick > 10 ? 6 : 12;
              },
              axisTickLabelModulus: ({ pxWidth, view }) => {
                const pxPerTick = pxWidth / view.width;
                return pxPerTick > 5 ? 12 : 24;
              },
            }}
          />
          <YAxis
            tickPositions={[0, 100, 200]}
            getTickLabel={(pos) => String(pos)}
            intercept={view.xMin}
            axisLabel="Precipitation (mm)"
          />
        </Chart>
      </div>
    </React.Fragment>
  );
};

export default HomepageTimeseries;
