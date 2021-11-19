import * as React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import {
  Chart,
  BarVerticalSeries,
  LineSeries,
  RangeVerticalSeries,
  XAxis,
  YAxis,
  getSeriesColors,
} from '../../../../src';

const scope = {
  Chart,
  BarVerticalSeries,
  LineSeries,
  RangeVerticalSeries,
  XAxis,
  YAxis,
  getSeriesColors,
};

const ReactLiveProvider = ({ code }) => {
  return (
    <LiveProvider code={code} scope={scope}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default ReactLiveProvider;
