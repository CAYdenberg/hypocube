import { useCallback, useEffect, useRef, useState } from 'react';
import { CanvasComponent } from '../types';
import Viewbox from '../lib/Viewbox';

export default (pxBox: Viewbox, isCanvas: boolean) => {
  const canvasNode = useRef<HTMLCanvasElement | null>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const dpr = useRef<number>(0);

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

  const setDpr = useCallback(() => {
    if (!canvasNode.current) {
      return;
    }
    dpr.current = window.devicePixelRatio || 1;
    canvasNode.current.style.width = canvasNode.current.width + 'px';
    canvasNode.current.style.height = canvasNode.current.height + 'px';
    canvasNode.current.width *= dpr.current;
    canvasNode.current.height *= dpr.current;
  }, []);

  const onRenderCanvas = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) {
      canvasNode.current = null;
      canvasContext.current = null;
      return;
    }
    canvasNode.current = node;
    canvasContext.current = canvasNode.current.getContext('2d');

    // set canvas sizes, and get the device pixel ratio for scaling
    setDpr();

    // if the child components run before the canvas DOM node renders, will
    // need to re-run them to draw on canvas
    forceUpdate();
    // forceUpdate should never change; callback runs only when canvas DOM node
    // is rendered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when resizing occurs, set the canvas sizes again
  useEffect(() => {
    setDpr();
  }, [pxBox.hash, setDpr]);

  // this is a "no-dependency" useEffect: it should run *after* rendering
  // every time
  useEffect(() => {
    if (!canvasContext.current) return;

    canvasContext.current.scale(dpr.current, dpr.current);
    canvasContext.current.clearRect(0, 0, pxBox.x[1], pxBox.y[1]);
    canvasContext.current!.setTransform(1, 0, 0, 1, 0, 0);

    queue.forEach((func) => {
      canvasContext.current!.save();
      canvasContext.current!.scale(dpr.current, dpr.current);
      func(canvasContext.current!, dpr.current);

      canvasContext.current!.globalAlpha = 1;
      canvasContext.current!.restore();
      canvasContext.current!.setTransform(1, 0, 0, 1, 0, 0);
    });
  });

  return {
    pushToCanvasQueue,
    onRenderCanvas,
  };
};
