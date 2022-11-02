import { ScaleLinear } from 'd3-scale';
import React from 'react';
import { CurveType, DashType } from './components/primitives/Line';
import { SymbolType } from './components/primitives/Symbol';
import Viewbox from './api/Viewbox';

/**
 * CHART STATE AND GENERAL DEFINITIONS
 */
export type Point = [number, number];

export type PointYRange = [number, number[]];

export type CanvasComponent = (
  renderer: CanvasRenderingContext2D,
  dpr: number
) => void;

export interface ChartState {
  cartesianBox: Viewbox;
  pxBox: Viewbox;
  scaleX: ScaleLinear<number, number, number>;
  scaleY: ScaleLinear<number, number, number>;
  isCanvas: boolean;
  pushToCanvasQueue: ((func: CanvasComponent) => void) | null;
}

/**
 * CHART STYLE DEFINITIONS
 */

export type ChartStyleFunction<T> = (sizes: {
  pxWidth: number;
  pxHeight: number;
  view: Viewbox;
}) => T;

export type Contextual<T> = T | ChartStyleFunction<T>;

export type AxisLabelPosition = [number, number];

export interface ChartStyleT {
  fontSize: number;
  fontFamily: string;
  svgPointerEvents: boolean;
  htmlLayerPointerEvents: boolean;

  axisColor: string;
  axisStrokeWidth: number;
  axisTickLength: number;
  axisTickOffset: number;
  axisTickModulus: number;
  axisTickLabelOffset: number;
  axisTickLabelModulus: number;

  xAxisLabelPosition: number;
  yAxisLabelPosition: number;

  seriesXOffset: number;
  seriesOpacity: number;

  dataBoxFill: string;
  dataBoxStroke: string;
  dataBoxStrokeWidth: number;
  dataBoxThickness: number;

  dataPointSymbol: SymbolType;
  dataPointSize: number;
  dataPointRotation: number;
  dataPointFill: string;
  dataPointStroke: string;
  dataPointStrokeWidth: number;
  dataPointMinTargetRadius: number;

  dataLineCurveType: CurveType;
  dataLineDashType: DashType;
  dataLineStroke: string;
  dataLineStrokeWidth: number;

  dataRangeStroke: string;
  dataRangeStrokeWidth: number;
  dataRangeCapLength: number;

  dataAreaFill: string;

  gridColor: string;
  gridDashStyle: DashType;
  gridStrokeWidth: number;
}

type CreateChartStyleOptions<T> = {
  [Property in keyof T]?: Contextual<T[Property]>;
};

export type ChartStyleOptions = CreateChartStyleOptions<ChartStyleT>;

/**
 * EVENT DEFINITIONS
 */

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

export interface ChartEvent {
  event: ReactEvent;
  pointerId: number | null;
  pointerPosition?: [number, number];
  elementPosition?: [number, number];
  modifiers: Array<string>;
  meta: ChartEventMetaData;
}

export type ChartEventHandler = (data: ChartEvent) => void;

export type ChartEventHandlers = {
  [Property in keyof ReactHandlers]: ChartEventHandler;
};

/**
 * GESTURE DEFINITIONS
 */

export enum GesturePhase {
  Start = 'Start',
  Continue = 'Continue',
  End = 'End',
}

export enum GestureIntent {
  Scroll = 'Scroll',
  Swipe = 'Swipe',
  Zoom = 'Zoom',
}

export enum GestureMeta {
  Wheel = 'Wheel',
  Trackpad = 'Trackpad',
}

export interface ChartGestureEvent {
  phase: GesturePhase;
  intent: GestureIntent;
  state: unknown;
  transform: (initial: Viewbox) => Viewbox;
}

export interface ChartGestureHandlers {
  onGesture?: (data: ChartGestureEvent) => void;
}

export interface Dataseries {
  data: Point[];
  key: string;
  meta?: ChartEventMetaData;
}

export interface ChartAnimation<T> {
  duration: number;
  step: (progress: number) => T;
}
