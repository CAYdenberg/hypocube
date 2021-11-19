import React from 'react';
import {
  Chart,
  XAxis,
  YAxis,
  Line,
  getSeriesColors,
  usePannable,
  ChartGestureData,
  list,
  Viewbox,
} from '../src';

interface Props {
  isCanvas?: boolean;
}

const GestureDemo: React.FC<Props> = ({ isCanvas }) => {
  const { onGesture, view, scrollToView } = usePannable([-10, -10, 20, 20]);

  return (
    <React.Fragment>
      <p>
        Left: {view.xMin.toFixed(2)} | Right: {view.xMax.toFixed(2)} | Top:{' '}
        {view.yMax.toFixed(2)} | Bottom: {view.yMin.toFixed(2)}
      </p>
      <p>
        <button type="button" onClick={() => scrollToView(view.zoom(0.5))}>
          Zoom Out
        </button>
        <button type="button" onClick={() => scrollToView(view.zoom(2))}>
          Zoom In
        </button>
      </p>
      <TheChart isCanvas={isCanvas} onGesture={onGesture} view={view} />
    </React.Fragment>
  );
};

export default GestureDemo;

interface TheChartProps {
  isCanvas?: boolean;
  view: Viewbox;
  onGesture: (data: ChartGestureData) => void;
}

const TheChart: React.FC<TheChartProps> = ({ isCanvas, view, onGesture }) => (
  <div style={{ maxWidth: 300 }}>
    <Chart
      height={(width) => width}
      ssWidth={300}
      view={view}
      isCanvas={isCanvas}
      onGesture={onGesture}
    >
      {getSeriesColors(['#FFF', '#00F'], 11).map((color, val) => (
        <Line
          path={[
            [0, val * 5],
            [val * 5, 0],
            [0, val * -5],
            [val * -5, 0],
            [0, val * 5],
          ]}
          stroke={color}
          key={color}
        />
      ))}
      <XAxis
        tickPositions={list(21, (val) => val * 5 - 50)}
        getTickLabel={String}
      />
      <YAxis
        tickPositions={list(21, (val) => val * 5 - 50)}
        getTickLabel={String}
      />
    </Chart>
  </div>
);
