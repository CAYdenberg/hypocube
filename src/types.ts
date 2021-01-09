import { ScaleLinear } from 'd3-scale';

export type Point = [number, number];

export interface Scale {
  x: [number, number];
  y: [number, number];
}

export interface ChartState {
  isCanvas: boolean;
  cartesianBox: Scale;
  pxBox: Scale;
  scaleX: ScaleLinear<number, number, number>;
  scaleY: ScaleLinear<number, number, number>;
  containerOffset: [number, number];
  renderer?: CanvasRenderingContext2D | null;
}

export type Event =
  | React.MouseEvent<SVGGElement>
  | React.PointerEvent<SVGGElement>;

export type Contextual<T> = (chartState: ChartState) => T | T;

export interface Interaction {
  event: Event;
  elementPosition: [number, number];
  pointerPosition: [number, number];
  meta: {
    [key: string]: string | number | boolean;
  };
}

export interface Handlers {
  onClick: Event;
  onMouseOver: Event;
  onDrag: Event;
}
