import React from 'react';
import { normalize } from '../../lib/normalize';
import { ChartStyleOptions } from '../../types';
import useChartState from '../base/ChartState';
import { useChartStyle } from '../base/ChartStyle';
import { Line } from '../primitives/Line';

export interface GridProps {
  xLines?: number[];
  yLines?: number[];
  chartStyle?: ChartStyleOptions;
}

export const Grid: React.FC<GridProps> = (props) => {
  const { cartesianBox } = useChartState();
  const xLines = normalize(props.xLines, []);
  const yLines = normalize(props.yLines, []);

  const {
    gridDashStyle,
    gridColor,
    gridStrokeWidth,
    svgPointerEvents,
  } = useChartStyle(props.chartStyle);

  return (
    <React.Fragment>
      {xLines.map((y) => (
        <Line
          key={y}
          path={[
            [cartesianBox.xMin, y],
            [cartesianBox.xMax, y],
          ]}
          strokeWidth={gridStrokeWidth}
          stroke={gridColor}
          dash={gridDashStyle}
          svgPointerEvents={svgPointerEvents}
        />
      ))}
      {yLines.map((x) => (
        <Line
          key={x}
          path={[
            [x, cartesianBox.yMin],
            [x, cartesianBox.xMax],
          ]}
          strokeWidth={gridStrokeWidth}
          stroke={gridColor}
          dash={gridDashStyle}
          svgPointerEvents={svgPointerEvents}
        />
      ))}
    </React.Fragment>
  );
};
