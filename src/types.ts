import { ScaleLinear } from 'd3-scale';
import { curveType, dashType } from './components/primitives/Line';
import { symbolType } from './components/primitives/Symbol';

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

export type Contextual<T> = T | ((chartState: ChartState) => T);

export interface ChartStyleOptions {
  baseFontSize?: Contextual<number>;
  axisColor?: Contextual<string>;
  axisThickness?: Contextual<string>;
  axisTickLength?: Contextual<number>;
  axisTickOffset?: Contextual<number>;
  axisTickLabelOffset?: Contextual<number>;
  axisLabelOffset?: Contextual<number>;

  dataFill?: Contextual<string>;
  dataStroke?: Contextual<string>;
  dataStrokeWidth?: Contextual<number>;
  dataBoxThickness?: Contextual<number>;
  dataPointSize?: Contextual<number>;
  dataPointSymbol?: Contextual<symbolType>;
  dataLineCurveType?: Contextual<curveType>;
  dataLineDashType?: Contextual<dashType>;
}

export interface ChartStyleT {
  baseFontSize: number;
  axisColor: string;
  axisThickness: number;
  axisTickLength: number;
  axisTickOffset: number;
  axisTickLabelOffset: number;
  axisLabelOffset: number;

  dataFill: string;
  dataStroke: string;
  dataStrokeWidth: number;
  dataBoxThickness: number;
  dataPointSize: number;
  dataPointSymbol: symbolType;
  dataLineCurveType: curveType;
  dataLineDashType: dashType;
}

export type ReactEvent =
  | React.PointerEvent<SVGGElement>
  | React.PointerEvent<HTMLDivElement>
  | React.WheelEvent<SVGGElement>
  | React.WheelEvent<HTMLDivElement>;

export interface ReactHandlers {
  onPointerDown?: (e: ReactEvent) => void;
  onPointerMove?: (e: ReactEvent) => void;
  onPointerUp?: (e: ReactEvent) => void;
  onPointerCancel?: (e: ReactEvent) => void;
  onGotPointerCapture?: (e: ReactEvent) => void;
  onLostPointerCapture?: (e: ReactEvent) => void;
  onPointerEnter?: (e: ReactEvent) => void;
  onPointerLeave?: (e: ReactEvent) => void;
  onPointerOver?: (e: ReactEvent) => void;
  onPointerOut?: (e: ReactEvent) => void;
  onWheel?: (e: ReactEvent) => void;
}

export interface HypocubeEventData {
  event: ReactEvent;
  pointerPosition: [number, number];
  elementPosition?: [number, number];
  meta: {
    [key: string]: string | number | boolean;
  };
}

export type HypocubeHandler = (data: HypocubeEventData) => void;

export interface HypocubeHandlers {
  onPointerDown?: HypocubeHandler;
  onPointerMove?: HypocubeHandler;
  onPointerUp?: HypocubeHandler;
  onPointerCancel?: HypocubeHandler;
  onGotPointerCapture?: HypocubeHandler;
  onLostPointerCapture?: HypocubeHandler;
  onPointerEnter?: HypocubeHandler;
  onPointerLeave?: HypocubeHandler;
  onPointerOver?: HypocubeHandler;
  onPointerOut?: HypocubeHandler;
  onWheel?: HypocubeHandler;
}
