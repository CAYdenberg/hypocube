import React, { ReactNode } from 'react';
import { DelegateHandler, HypocubeHandlers } from '../../types';

interface Props extends HypocubeHandlers {
  debounceCalculation: number;
  children: (delegateHandler: DelegateHandler) => ReactNode;
}

const VoronoiDelegateHandler: React.FC<Props> = ({ children }) => {
  const delegate = ({ elementPosition, meta }) => null;

  return <g>{children(delegate)}</g>;
};

export default VoronoiDelegateHandler;
