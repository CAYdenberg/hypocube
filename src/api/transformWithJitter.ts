import { Point } from '../types';

interface Options {
  binWidth: number;
  maxFrequency: number;
  maxDisplacement: number;
}

const defaultOptions: Options = {
  binWidth: 5,
  maxFrequency: 10,
  maxDisplacement: 0.33,
};

export const segment = (data: number[], binWidth = 5): number[][] => {
  let breakpoints: number[] = [];

  const max = Math.max(...data);
  const min = Math.min(...data);
  let x = min;

  // create a set of breakpoints, binWidth apart, that go at least as high
  // as the max value in the data
  do {
    breakpoints.push(x);
    x = x + binWidth;
  } while (x <= max);

  return breakpoints.map((breakpoint) => {
    return data.filter(
      (datapoint) =>
        datapoint >= breakpoint && datapoint < breakpoint + binWidth
    );
  });
};

// TODO: fix the displacement algorithm (it should go 0, -1, 1 or 0, -0.5, 0.5, -1, 1 and
// should alternate depending if the SEGMENT is even or odd)

// Needs to preserve the order!

// Should deal with Points instead of numbers?

export default (data: number[], optionsArgs?: Partial<Options>): Point[] => {
  // merge options
  const { binWidth, maxFrequency, maxDisplacement } = optionsArgs
    ? {
        ...defaultOptions,
        ...optionsArgs,
      }
    : defaultOptions;

  return segment(data, binWidth)
    .map((seg) => {
      const cappedFrequency =
        seg.length > maxFrequency ? maxFrequency : seg.length;
      const maxOffset = (cappedFrequency * maxDisplacement) / maxFrequency;
      const offsetStep = maxOffset / seg.length;

      return seg.map((val, i) => {
        const absOffset = i * offsetStep;
        const offset = absOffset * (i % 2 === 0 ? 1 : -1);
        return [offset, val] as Point;
      });
    })
    .reduce((acc, seg) => acc.concat(seg));
};
