import React, { useState } from 'react';
import {
  Chart,
  XAxis,
  YAxis,
  Line,
  getSeriesColors,
  list,
  Symbol,
  createUseInterpolatedEffect,
  Point,
} from '../src';

interface Props {
  isCanvas?: boolean;
}

const useInterpolatedEffect = createUseInterpolatedEffect<TheChartProps>(
  (prev, next) => {
    if (prev.pos[0] === next.pos[0] && prev.pos[1] === next.pos[1]) {
      return next;
    }

    return (progress: number) => {
      const dX = next.pos[0] - prev.pos[0];
      const dY = next.pos[1] - prev.pos[1];
      const pos = [
        prev.pos[0] + dX * progress,
        prev.pos[1] + dY * progress,
      ] as Point;
      return {
        ...next,
        pos,
      };
    };
  },
  {
    animationDuration: 10 * 1000, // 10 seconds
  }
);

const AnimationDemo: React.FC<Props> = ({ isCanvas }) => {
  const [pos, setPos] = useState<[number, number]>([0, 0]);

  return <TheChart isCanvas={isCanvas} pos={pos} setPos={setPos} />;
};

export default AnimationDemo;

interface TheChartProps {
  isCanvas?: boolean;
  pos: [number, number];
  setPos: (next: [number, number]) => void;
}

const TheChart: React.FC<TheChartProps> = (props) => {
  const [{ pos, setPos, isCanvas }, isAnimating] = useInterpolatedEffect(props);

  return (
    <div style={{ maxWidth: 500 }}>
      <Chart
        height={(width) => width}
        ssWidth={500}
        view={[-50, -50, 100, 100]}
        isCanvas={isCanvas || isAnimating}
        onPointerDown={(ev) => ev.pointerPosition && setPos(ev.pointerPosition)}
      >
        {getSeriesColors(['#FFF', '#00F'], 6).map((color, val) => (
          <Line
            path={[
              [0, val * 10],
              [val * 10, 0],
              [0, val * -10],
              [val * -10, 0],
              [0, val * 10],
            ]}
            stroke={color}
            key={color}
          />
        ))}
        <XAxis
          tickPositions={list(11, (val) => val * 10 - 50)}
          getTickLabel={String}
        />
        <YAxis
          tickPositions={list(11, (val) => val * 10 - 50)}
          getTickLabel={String}
        />
        <Symbol symbol="circle" fill="red" size={100} point={pos} />
      </Chart>
    </div>
  );
};
