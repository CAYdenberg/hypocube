import { useEffect, useRef } from 'react';
import Viewbox from '../lib/Viewbox';

export type CanvasComponent = (renderer: CanvasRenderingContext2D) => void;

export default (pxBox: Viewbox, isCanvas: boolean) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  // create a new canvas context if the canvas DOM node changes
  useEffect(() => {
    const canvasEl = canvasRef.current;
    context.current = canvasEl ? canvasEl.getContext('2d') : null;
  }, [canvasRef.current]);

  const queue: Array<CanvasComponent> = [];
  const pushToCanvasQueue = isCanvas
    ? (func: CanvasComponent) => {
        queue.push(func);
      }
    : null;

  useEffect(() => {
    if (!context.current) return;

    context.current.clearRect(0, 0, pxBox.x[1], pxBox.y[1]);

    queue.forEach((func) => {
      func(context.current!);
      context.current!.restore();
      context.current!.setTransform(1, 0, 0, 1, 0, 0);
    });
  });

  return {
    pushToCanvasQueue,
    canvasRef,
  };
};
