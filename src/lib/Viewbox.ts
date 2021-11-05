import { Point } from '../types';

export type Range = [number, number];
export type ViewboxDuck = Viewbox | [number, number, number, number];

interface ConstrainOptions {
  maxZoomX?: number;
  maxZoomY?: number;
}
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

  bisectX(fraction: number = 0.5): number {
    return fraction * this.width + this.xMin;
  }

  bisectY(fraction: number = 0.5): number {
    return fraction * this.height + this.yMin;
  }

  bound(boundingBox: ViewboxDuck | null): Viewbox {
    if (!boundingBox) return this;
    const _bound = createViewbox(boundingBox);

    return new Viewbox(
      Math.max(
        this.xMax > _bound.xMax ? _bound.xMax - this.width : this.xMin,
        _bound.xMin
      ),

      Math.max(
        this.yMax > _bound.yMax ? _bound.yMax - this.height : this.yMin,
        _bound.yMin
      ),

      Math.min(this.width, _bound.width),
      Math.min(this.height, _bound.height)
    );
  }

  constrainZoom({ maxZoomX, maxZoomY }: ConstrainOptions) {
    const _x =
      maxZoomX && this.width < maxZoomX
        ? new Viewbox(
            this.bisectX() - maxZoomX / 2,
            this.yMin,
            maxZoomX,
            this.height
          )
        : this;

    const _y =
      maxZoomY && _x.height < maxZoomY
        ? new Viewbox(_x.xMin, _x.bisectY() - maxZoomY / 2, _x.width, maxZoomY)
        : _x;

    return _y;
  }

  isEqual(test: ViewboxDuck) {
    const _test = createViewbox(test);
    return _test.hash === this.hash;
  }
}

export const createViewbox = (input: ViewboxDuck): Viewbox =>
  Array.isArray(input) ? new Viewbox(...input) : input;
