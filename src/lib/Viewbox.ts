import { Point } from '../types';

export type Range = [number, number];
export type ViewboxDuck = Viewbox | [number, number, number, number];
export default class Viewbox {
  public readonly xMin: number;
  public readonly yMin: number;
  public readonly width: number;
  public readonly height: number;
  public readonly xMax: number;
  public readonly yMax: number;
  public readonly x: Range;
  public readonly y: Range;
  public readonly hash: string;

  constructor(xMin: number, yMin: number, width: number, height: number) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.width = width;
    this.height = height;
    this.xMax = xMin + width;
    this.yMax = yMin + height;
    this.x = [xMin, this.xMax];
    this.y = [yMin, this.yMax];
    this.hash = `${xMin},${yMin},${width},${height}`;
  }

  toPath(): Point[] {
    const { xMin, xMax, yMin, yMax } = this;
    return [
      [xMin, yMin],
      [xMax, yMin],
      [xMax, yMax],
      [xMin, yMax],
    ];
  }

  panX(distance: number): Viewbox {
    return new Viewbox(
      this.xMin + distance,
      this.yMin,
      this.width,
      this.height
    );
  }

  panY(distance: number): Viewbox {
    return new Viewbox(
      this.xMin,
      this.yMin + distance,
      this.width,
      this.height
    );
  }

  zoom(factor: number, anchor?: Point): Viewbox {
    // default anchor is the center of the box:
    anchor =
      anchor ||
      ([this.width / 2 + this.xMin, this.height / 2 + this.yMin] as Point);

    const relativeAnchor = [
      (anchor[0] - this.xMin) / this.width,
      (anchor[1] - this.yMin) / this.height,
    ];

    const width = this.width / factor;
    const dXMin = (this.width - width) * relativeAnchor[0];

    const height = this.height / factor;
    const dYMin = (this.height - height) * relativeAnchor[1];

    return new Viewbox(this.xMin + dXMin, this.yMin + dYMin, width, height);
  }

  interpolate(final: Viewbox, progress: number): Viewbox {
    return new Viewbox(
      this.xMin + progress * (final.xMin - this.xMin),
      this.yMin + progress * (final.yMin - this.yMin),
      this.width + progress * (final.width - this.width),
      this.height + progress * (final.height - this.height)
    );
  }
}

export const createViewbox = (input: ViewboxDuck): Viewbox =>
  Array.isArray(input) ? new Viewbox(...input) : input;

export const bound = (
  view: ViewboxDuck,
  boundingBox?: ViewboxDuck | null
): Viewbox => {
  const _view = createViewbox(view);
  if (!boundingBox) {
    return _view;
  }

  const _bound = createViewbox(boundingBox);

  return new Viewbox(
    Math.max(
      _view.xMax > _bound.xMax ? _bound.xMax - _view.width : _view.xMin,
      _bound.xMin
    ),

    Math.max(
      _view.yMax > _bound.yMax ? _bound.yMax - _view.height : _view.yMin,
      _bound.yMin
    ),

    Math.min(_view.width, _bound.width),
    Math.min(_view.height, _bound.height)
  );
};
