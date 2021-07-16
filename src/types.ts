import { ScaleLinear } from 'd3-scale';
import { curveType, dashType } from './components/primitives/Line';
import { symbolType } from './components/primitives/Symbol';
import { CanvasComponent } from './lib/useCanvas';
import Viewbox from './lib/Viewbox';

export type Point = [number, number];

export interface ChartState {
  isCanvas: boolean;
  cartesianBox: Viewbox;
  pxBox: Viewbox;
  scaleX: ScaleLinear<number, number, number>;
  scaleY: ScaleLinear<number, number, number>;
  containerOffset: [number, number];
  pushToCanvasQueue: (func: CanvasComponent) => void;
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

  dataBoxFill?: Contextual<string>;
  dataBoxStroke?: Contextual<string>;
  dataBoxStrokeWidth?: Contextual<number>;
  dataBoxThickness?: Contextual<number>;
  dataBoxLeftOffset?: Contextual<number>;

  dataPointSize?: Contextual<number>;
  dataPointSymbol?: Contextual<symbolType>;
  dataPointFill?: Contextual<string>;
  dataPointStroke?: Contextual<string>;
  dataPointStrokeWidth?: Contextual<number>;
  dataPointMinTargetRadius?: Contextual<number>;

  dataLineCurveType?: Contextual<curveType>;
  dataLineDashType?: Contextual<dashType>;
  dataLineStroke?: Contextual<string>;
  dataLineStrokeWidth?: Contextual<number>;
}

export interface ChartStyleT {
  baseFontSize: number;
  axisColor: string;
  axisThickness: number;
  axisTickLength: number;
  axisTickOffset: number;
  axisTickLabelOffset: number;
  axisLabelOffset: number;

  dataBoxFill: string;
  dataBoxStroke: string;
  dataBoxStrokeWidth: number;
  dataBoxThickness: number;
  dataBoxLeftOffset: number;

  dataPointSize: number;
  dataPointSymbol: symbolType;
  dataPointFill: string;
  dataPointStroke: string;
  dataPointStrokeWidth: number;
  dataPointMinTargetRadius: number;

  dataLineCurveType: curveType;
  dataLineDashType: dashType;
  dataLineStroke: string;
  dataLineStrokeWidth: number;
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
}

export type ChartEventMetaData = Record<
  string,
  string | number | boolean | null
>;

export interface ChartEventData {
  event: ReactEvent;
  pointerPosition: [number, number];
  pointerId: number | null;
  elementPosition?: [number, number];
  modifiers: Array<string>;
  meta: ChartEventMetaData;
}

export type ChartEventHandler = (data: ChartEventData) => void;

export enum GestureKind {
  Drag = 'Drag',
  Swipe = 'Swipe',
  Pinch = 'Pinch',
  Wheel = 'Wheel',
}

export enum GesturePhase {
  Start = 'Start',
  Continue = 'Continue',
  End = 'End',
}

export interface ChartGestureData {
  kind: GestureKind;
  phase: GesturePhase;
  nextView: Viewbox;
  state: any;
}

export interface ChartEventHandlers {
  onPointerDown?: ChartEventHandler;
  onPointerMove?: ChartEventHandler;
  onPointerUp?: ChartEventHandler;
  onPointerCancel?: ChartEventHandler;
  onGotPointerCapture?: ChartEventHandler;
  onLostPointerCapture?: ChartEventHandler;
  onPointerEnter?: ChartEventHandler;
  onPointerLeave?: ChartEventHandler;
  onPointerOver?: ChartEventHandler;
  onPointerOut?: ChartEventHandler;
  onGesture?: (data: ChartGestureData) => void;
}

export type ChartAnimation = (time: number, end: () => void) => Viewbox;

export interface Dataseries {
  data: Point[];
  key: string;
  meta?: ChartEventMetaData;
}
