import { ScaleLinear } from 'd3-scale';
import React from 'react';
import { curveType, dashType } from './components/primitives/Line';
import { symbolType } from './components/primitives/Symbol';
import { CanvasComponent } from './lib/useCanvas';
import Viewbox from './lib/Viewbox';

export type Point = [number, number];

export interface ChartState {
  cartesianBox: Viewbox;
  pxBox: Viewbox;
  scaleX: ScaleLinear<number, number, number>;
  scaleY: ScaleLinear<number, number, number>;
  isCanvas: boolean;
  pushToCanvasQueue: ((func: CanvasComponent) => void) | null;
}

export type ChartStyleFunction<T> = (sizes: {
  pxWidth: number;
  pxHeight: number;
}) => T;

export type Contextual<T> = T | ChartStyleFunction<T>;

export type AxisLabelPosition = [number, number];

export interface ChartStyleT {
  fontSize: number;

  axisColor: string;
  axisStrokeWidth: number;
  axisTickLength: number;
  axisTickOffset: number;
  axisTickLabelOffset: number;

  xAxisLabelPosition: number;
  yAxisLabelPosition: number;

  seriesXOffset: number;

  dataBoxFill: string;
  dataBoxStroke: string;
  dataBoxStrokeWidth: number;
  dataBoxThickness: number;

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

  dataRangeAnchorLength: number;
  dataRangeAnchorStroke: string;
  dataRangeAnchorStrokeWidth: number;

  dataWhiskerTopCapLength: number;
  dataWhiskerBottomCapLength: number;
  dataWhiskerStroke: string;
  dataWhiskerStrokeWidth: number;
}

type CreateChartStyleOptions<T> = {
  [Property in keyof T]?: Contextual<T[Property]>;
};

export type ChartStyleOptions = CreateChartStyleOptions<ChartStyleT>;

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
  pointerId: number | null;
  pointerPosition?: [number, number];
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

export type ChartEventHandlers = {
  [Property in keyof ReactHandlers]: ChartEventHandler;
};

export interface ChartGestureHandlers {
  onGesture?: (data: ChartGestureData) => void;
}

export interface Dataseries {
  data: Point[];
  key: string;
  meta?: ChartEventMetaData;
}
