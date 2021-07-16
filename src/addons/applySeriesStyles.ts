import interpolate from 'color-interpolate';
import { ChartStyleOptions, Dataseries } from '../types';

export interface DataseriesStyled extends Dataseries {
  chartStyle: ChartStyleOptions;
}

export type SeriesStyleFactory = (
  styleSet: ChartStyleOptions[]
) => ChartStyleOptions[];

type Interpolator = (fraction: number) => string;

export const createStylesSequential = (
  key: keyof ChartStyleOptions | Array<keyof ChartStyleOptions>,
  values: string[]
): SeriesStyleFactory => (styleSet) => {
  if (Array.isArray(key)) {
    return key.reduce((acc, key) => {
      return createStylesSequential(key, values)(acc);
    }, styleSet);
  }

  return styleSet.map((styles, i) => ({
    ...styles,
    [key]: values[i % values.length],
  }));
};

export const createStylesInterpolate = (
  key: keyof ChartStyleOptions | Array<keyof ChartStyleOptions>,
  interpolator: Interpolator
): SeriesStyleFactory => (styleSet) => {
  if (Array.isArray(key)) {
    return key.reduce((acc, key) => {
      return createStylesInterpolate(key, interpolator)(acc);
    }, styleSet);
  }

  return styleSet.map((styles, i) => ({
    ...styles,
    [key]: interpolator(i / styleSet.length),
  }));
};

export const createBarOffsets: SeriesStyleFactory = (styleSet) => {
  const start = -1 * (styleSet.length / 2);

  return styleSet.map((styles, i) => ({
    ...styles,
    dataBoxLeftOffset: start + i,
  }));
};

interface ColorEndpoints {
  from: string;
  to: string;
}

type Colors = string | string[] | ColorEndpoints;

interface Options {
  xOffsets?: boolean;
  colors?: Colors;
}

const isColorEndpoints = (colors?: Colors): colors is ColorEndpoints => {
  return !!(colors as ColorEndpoints).from;
};

export default (
  seriesSet: Dataseries[],
  options: Options
): DataseriesStyled[] => {
  let styles = new Array(seriesSet.length).fill({} as ChartStyleOptions);

  if (options.xOffsets !== false) {
    styles = createBarOffsets(styles);
  }

  if (isColorEndpoints(options.colors)) {
    const interpolator = interpolate([options.colors.from, options.colors.to]);

    styles = createStylesInterpolate(
      [
        'dataBoxStroke',
        'dataBoxFill',
        'dataLineStroke',
        'dataPointStroke',
        'dataPointFill',
      ],
      interpolator
    )(styles);
  } else if (options.colors) {
    const colors = Array.isArray(options.colors)
      ? options.colors
      : [options.colors];
    styles = createStylesSequential(
      [
        'dataBoxStroke',
        'dataBoxFill',
        'dataLineStroke',
        'dataPointStroke',
        'dataPointFill',
      ],
      colors
    )(styles);
  }

  return seriesSet.map((series, i) => ({
    ...series,
    chartStyle: styles[i],
  }));
};
