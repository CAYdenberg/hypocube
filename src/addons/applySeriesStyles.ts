import { ChartStyleOptions, Point } from '../types';

export interface SeriesWithStyle {
  data: Point[];
  chartStyle: ChartStyleOptions;
}

export type SeriesStyleFactory = (
  styleSet: ChartStyleOptions[]
) => ChartStyleOptions[];

export type Interpolator = (fraction: number) => string;

export const mapStylesSequential = (
  key: keyof ChartStyleOptions,
  values: string[]
): SeriesStyleFactory => (styleSet) => {
  return styleSet.map((styles, i) => ({
    ...styles,
    [key]: values[i % values.length],
  }));
};

export const mapStylesInterpolate = (
  key: keyof ChartStyleOptions,
  interpolator: Interpolator
): SeriesStyleFactory => (styleSet) => {
  if (!styleSet.length) {
    return styleSet;
  }

  return styleSet.map((styles, i) => ({
    ...styles,
    [key]: interpolator(i / styleSet.length),
  }));
};

export const mapBarOffsets: SeriesStyleFactory = (styleSet) => {
  const start = styleSet.length / -2;

  return styleSet.map((styles, i) => ({
    ...styles,
    dataBoxLeftOffset: start + i,
  }));
};

interface Options {
  xOffsets?: boolean;
  colors?: string | string[] | Interpolator;
}

export default (seriesSet: Point[][], options: Options): SeriesWithStyle[] => {
  let styles = new Array(seriesSet.length).fill({} as ChartStyleOptions);

  return seriesSet.map((series, i) => ({
    data: series,
    chartStyle: styles[i],
  }));
};
