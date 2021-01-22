import { ScaleLinear } from 'd3-scale';

export type Point = [number, number];

export type Range = [number, number];

export interface Viewbox {
  x: Range;
  y: Range;
}

export interface ChartState {
  isCanvas: boolean;
  cartesianBox: Viewbox;
  pxBox: Viewbox;
  scaleX: ScaleLinear<number, number, number>;
  scaleY: ScaleLinear<number, number, number>;
  containerOffset: [number, number];
  renderer?: CanvasRenderingContext2D | null;
}

export type Event =
  | React.MouseEvent<SVGGElement>
  | React.PointerEvent<SVGGElement>;

export type Contextual<T> = T | ((chartState: ChartState) => T);
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

export interface ChartStyleOptions {
  baseFontSize?: Contextual<number>;
  axisColor?: Contextual<string>;
  axisThickness?: Contextual<string>;
  axisTickLength?: Contextual<number>;
  axisTickOffset?: Contextual<number>;
  axisTickLabelOffset?: Contextual<number>;
  axisLabelOffset?: Contextual<number>;

  databoxFill?: Contextual<string>;
  databoxStroke?: Contextual<string>;
  databoxStrokeWidth?: Contextual<number>;
  databoxThickness: Contextual<number>;
}

export interface ChartStyleT {
  baseFontSize: number;
  axisColor: string;
  axisThickness: number;
  axisTickLength: number;
  axisTickOffset: number;
  axisTickLabelOffset: number;
  axisLabelOffset: number;

  databoxFill?: string;
  databoxStroke?: string;
  databoxStrokeWidth?: number;
  databoxThickness: number;
}
