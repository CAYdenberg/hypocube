import React from 'react';
import {
  Chart,
  XAxis,
  YAxis,
  LineSeries,
  useTooltip,
  TooltipWrapper,
} from '../../../src';

const SimpleTooltip = ({ seriesColor, position, onRequestClose }) => (
  <TooltipWrapper onRequestClose={onRequestClose}>
    <div
      style={{
        padding: 2,
        background: 'white',
        border: '1px solid black',
        transform: 'translate(5px, -50%)',
      }}
    >
      <p>
        Series Color: <strong>{seriesColor}</strong>
      </p>
      <p>
        x: <strong>{position[0]}</strong>, y: <strong>{position[1]}</strong>
      </p>
    </div>
  </TooltipWrapper>
);

const TooltipDocsExample = () => {
  const [tooltipData, setTooltipData, handleCloseTooltip] = useTooltip();

  return (
    <Chart
      height={300}
      view={[0, 0, 4, 5]}
      gutter={[5, 5, 5, 5]}
      chartStyle={{
        dataPointSymbol: 'square',
        dataPointMinTargetRadius: 20,
      }}
      htmlLayer={
        tooltipData
          ? {
              position: tooltipData.position,
              render: (
                <SimpleTooltip
                  seriesColor={tooltipData?.meta.seriesColor}
                  position={tooltipData?.position}
                  onRequestClose={handleCloseTooltip}
                />
              ),
            }
          : null
      }
    >
      <XAxis />
      <YAxis />
      <LineSeries
        data={[
          [1, 3],
          [2, 2],
          [3, 3.5],
        ]}
        chartStyle={{
          dataLineStroke: 'green',
          dataPointFill: 'green',
        }}
        onPointerDown={setTooltipData}
        handlerMeta={{
          seriesColor: 'Green',
        }}
      />
      <LineSeries
        data={[
          [1, 1],
          [2, 3],
          [3, 4],
        ]}
        chartStyle={{
          dataLineStroke: 'blue',
          dataPointFill: 'blue',
        }}
        onPointerDown={setTooltipData}
        handlerMeta={{
          seriesColor: 'Blue',
        }}
      />
    </Chart>
  );
};

export default TooltipDocsExample;
