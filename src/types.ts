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
}

export interface HypocubeEventData {
  event: ReactEvent;
  pointerPosition: [number, number];
  pointerId: number | null;
  elementPosition?: [number, number];
  modifiers: Array<string>;
  meta: {
    [key: string]: string | number | boolean;
  };
}

export type HypocubeHandler = (data: HypocubeEventData) => void;

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

export interface HypocubeGestureData {
  kind: GestureKind;
  phase: GesturePhase;
  nextView: Viewbox;
  state: any;
}

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
  onGesture?: (data: HypocubeGestureData) => void;
}

export type Animation = (time: number, end: () => void) => Viewbox;
