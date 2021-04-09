import { scaleTime } from 'd3-scale';
import React, { useState } from 'react';
import {
  Chart,
  HypocubeEventData,
  LineSeries,
  Point,
  XAxis,
  YAxis,
} from '../src';
import { rain } from './__data__/precipitation';

const SimpleTooltip: React.FC = () => (
  <div
    style={{
      background: 'white',
      border: '1px solid black',
      boxShadow: '12px 12px 2px 1px rgba(0, 0, 255, 0.2)',
    }}
  >
    <strong>Hello, world!</strong>
  </div>
);

const MultipleSeries: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const [tooltipPos, setTooltipPos] = useState<[number, number] | null>(null);

  const dates = rain.map((month) => new Date(month[0]));
  const scale = scaleTime(
    [dates[0], dates[dates.length - 1]],
    [0, dates.length]
  );
  const vancouver = rain.map(
    (month, i) => [scale(dates[i]), month[1]] as Point
  );
  const victoria = rain.map((month, i) => [scale(dates[i]), month[2]] as Point);
  const kelowna = rain.map((month, i) => [scale(dates[i]), month[3]] as Point);
  const tickPositions = Array.from({ length: 20 }, (_, i) => i * 12);
  const getXLabel = (pos: number) => String(dates[pos].getFullYear());

  const setTooltip = (data: HypocubeEventData) => {
    if (!data.elementPosition) {
      return;
    }
    setTooltipPos(data.elementPosition);
  };
  const clearTooltip = () => setTooltipPos(null);

  return (
    <Chart
      height={300}
      width={300}
      view={[0, 0, 255, 200]}
      gutter={[20, 20, 50, 50]}
      isCanvas={isCanvas}
      rootStyles={{
        dataPointSymbol: 'circle',
        dataPointMinTargetRadius: 10,
      }}
      tooltip={<SimpleTooltip />}
      tooltipPosition={tooltipPos}
    >
      <XAxis tickPositions={tickPositions} getTickLabel={getXLabel} />
      <YAxis
        tickPositions={[0, 50, 100, 200]}
        getTickLabel={(pos) => String(pos)}
      />
      <LineSeries data={vancouver} color="#003f5c" onPointerDown={setTooltip} />
      {/* <LineSeries data={victoria} color="#58508d" />
      <LineSeries data={kelowna} color="#bc5090" /> */}
    </Chart>
  );
};

export default MultipleSeries;
