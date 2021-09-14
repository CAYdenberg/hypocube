import { useCallback, useEffect, useRef, useState } from 'react';
import Viewbox from '../lib/Viewbox';

export type CanvasComponent = (renderer: CanvasRenderingContext2D) => void;

export default (pxBox: Viewbox, isCanvas: boolean) => {
  const canvasNode = useRef<HTMLCanvasElement | null>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

  const [_, setHash] = useState<number>(Math.random());
  const forceUpdate = useCallback(() => {
    setHash(Math.random());
  }, []);

  // these are intentionally recreated on every re-render to draw the canvas
  // on each frame
  const queue: Array<CanvasComponent> = [];
  const pushToCanvasQueue = isCanvas
    ? (func: CanvasComponent) => {
        queue.push(func);
      }
    : null;

  const onRenderCanvas = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) {
      canvasNode.current = null;
      canvasContext.current = null;
      return;
    }
    canvasNode.current = node;
    canvasContext.current = canvasNode.current.getContext('2d');

    // if the child components run before the canvas DOM node renders, will
    // need to re-run them to draw on canvas
    forceUpdate();
    // forceUpdate should never change; callback runs only when canvas DOM node
    // is rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // this is a "no-dependency" useEffect: it should run *after* rendering
  // every time
  useEffect(() => {
    if (!canvasContext.current) return;

    canvasContext.current.clearRect(0, 0, pxBox.x[1], pxBox.y[1]);

    queue.forEach((func) => {
      func(canvasContext.current!);
      canvasContext.current!.restore();
      canvasContext.current!.setTransform(1, 0, 0, 1, 0, 0);
    });
  });

  return {
    pushToCanvasQueue,
    onRenderCanvas,
  };
};
