import { useState } from 'react';
import { Viewbox } from '../types';

export default (startingView: Viewbox, sensitivityX: number) => {
  const isPointerDown = useState<boolean>(false);
  const dragPath = useState<Array<number>>([]);

  return {
    onPointerDown: undefined,
    onPointerUp: undefined,
    onPointerMove: undefined,
    dragPath,
    isPointerDown,
    deltaX: undefined,
    deltaY: undefined,
  };
};
