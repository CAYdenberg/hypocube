import * as React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Chart, BarVerticalSeries, XAxis, YAxis } from '../../../../src';

const scope = {
  Chart,
  BarVerticalSeries,
  XAxis,
  YAxis,
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
