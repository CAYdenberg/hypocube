import React from 'react';
import { Chart, LineSeries, Point, VoronoiHandle, XAxis, YAxis } from '../src';
import { useTooltip, TooltipWrapper } from '../src/addons/tooltip';
import { rain } from './__data__/precipitation';

const SimpleTooltip: React.FC<{
  seriesName?: string;
}> = ({ seriesName }) => (
  <div
    style={{
      background: 'white',
      border: '1px solid black',
      boxShadow: '12px 12px 2px 1px rgba(0, 0, 255, 0.2)',
      transform: 'translate(5px, -50%)',
    }}
  >
    <strong>{seriesName || ''}</strong>
  </div>
);

const MultipleSeries: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const [tooltipData, setTooltip, handleCloseTooltip] = useTooltip<{
    seriesName: string;
  }>();

  const series = rain.reduce(
    (series, month, i) => {
      const ys = month.slice(1) as number[];
      const row = ys.map((y) => [i, y] as Point);
      return series.map((s, j) => {
        return [...s, row[j]];
      });
    },
    [[], [], []] as Array<Array<Point>>
  );

  const labels = ['Vancouver', 'Victoria', 'Kelowna'];
  const colors = ['#003f5c', '#58508d', '#bc5090'];

  const tickPositions = series[0]
    .filter((_, i) => i % 12 === 0)
    .map((s) => s[0]);
  const getXLabel = (pos: number) => String(rain[pos][0]);

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
      tooltip={
        <TooltipWrapper onRequestClose={handleCloseTooltip}>
          <SimpleTooltip seriesName={tooltipData?.meta.seriesName} />
        </TooltipWrapper>
      }
      tooltipPosition={tooltipData?.position}
    >
      <XAxis tickPositions={tickPositions} getTickLabel={getXLabel} />
      <YAxis
        tickPositions={[0, 50, 100, 200]}
        getTickLabel={(pos) => String(pos)}
      />
      {series.map((s, i) => (
        <LineSeries
          key={labels[i]}
          data={s}
          color={colors[i]}
          onPointerDown={setTooltip}
          handlerMeta={{ seriesName: labels[i] }}
        />
      ))}
      <VoronoiHandle
        series={series}
        meta={series.map((_, i) => ({ seriesName: labels[i] }))}
        onPointerDown={setTooltip}
      />
    </Chart>
  );
};

export default MultipleSeries;
