import { ChartState, Point } from '../types';

const isAnyInView = (points: Point[], state: ChartState): boolean => {
  return !!points.find(([x, y]) => {
    const pxX = state.scaleX(x);
    const pxY = state.scaleY(y);
    const { pxBox } = state;
    return (
      pxX >= pxBox.xMin &&
      pxX <= pxBox.xMax &&
      pxY >= pxBox.yMin &&
      pxY <= pxBox.yMax
    );
  });
};

// TODO: need different type of filter for Bar (range?) that only works on one axis

export const filterToView = (data: Point[], state: ChartState) => {
  return data.filter((_, i) => {
    if (i === 0) {
      return isAnyInView(data.slice(0, 2), state);
    }
    return isAnyInView(data.slice(i - 1, i + 2), state);
  });
};

// NOTE: Purposefully implemented with for loops, as recursive functions
// can exceed stack size on large data sets.

// NOTE: Not using this as it seems to slow things down more than it helps

export const trimToView = (data: Point[], state: ChartState): Point[] => {
  let trimmed: Point[] = data;

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    if (isAnyInView([point], state) && i === 0) {
      break;
    }

    if (isAnyInView([point], state)) {
      trimmed = trimmed.slice(i - 1);
      break;
    }
  }

  for (let i = trimmed.length - 1; i > 0; i--) {
    const point = data[i];
    if (isAnyInView([point], state) && i === trimmed.length - 1) {
      break;
    }

    if (isAnyInView([point], state)) {
      trimmed = trimmed.slice(0, i + 1);
      break;
    }
  }

  return trimmed;
};
