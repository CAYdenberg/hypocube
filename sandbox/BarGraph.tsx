import React, { useCallback, useState } from 'react';
import { BarVerticalSeries, Chart, ChartEventData, XAxis, YAxis } from '../src';
import { bc as bcVaccinations } from './__data__/vaccinations';

const BarGraph: React.FC<{ isCanvas: boolean }> = ({ isCanvas }) => {
  const getXLabel = (x: number) => bcVaccinations[x - 1][0];
  const [selected, setSelected] = useState('n/a');
  const onPointerOver = useCallback((data: ChartEventData) => {
    if (!data.elementPosition) {
      return;
    }
    setSelected(
      `x: ${getXLabel(data.elementPosition[0])}, y: ${data.elementPosition[1]}`
    );
  }, []);
  const onPointerLeave = useCallback(() => setSelected('n/a'), []);

  return (
    <React.Fragment>
      <p>{selected}</p>
      <Chart
        height={300}
        view={[0, 0, 6, 9000]}
        gutter={[20, 50, 50, 50]}
        isCanvas={isCanvas}
      >
        <XAxis
          range={[0, 6]}
          tickPositions={[1, 2, 3, 4, 5, 6]}
          getTickLabel={getXLabel}
        />
        <YAxis range={[0, 9000]} tickPositions={[0, 3000, 6000, 9000]} />
        <BarVerticalSeries
          data={bcVaccinations.map((point, i) => [i + 1, point[1]])}
          onPointerOver={onPointerOver}
          onPointerLeave={onPointerLeave}
          chartStyle={{
            dataBoxFill: 'rgb(177, 0, 0)',
          }}
        />
      </Chart>
    </React.Fragment>
  );
};

export default BarGraph;
