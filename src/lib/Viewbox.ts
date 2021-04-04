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

  constructor(xMin: number, yMin: number, width: number, height: number) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.width = width;
    this.height = height;
    this.xMax = xMin + width;
    this.yMax = yMin + height;
    this.x = [xMin, this.xMax];
    this.y = [yMin, this.yMax];
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

  zoomX(amount: number, anchor: number = 0.5): Viewbox {
    const slideLeftMargin = amount * anchor;
    return new Viewbox(
      this.xMin + slideLeftMargin,
      this.yMin,
      this.width - amount,
      this.height
    );
  }

  zoomY(amount: number, anchor: number = 0.5): Viewbox {
    const slideBottomMargin = amount * anchor;
    return new Viewbox(
      this.xMin,
      this.yMin + slideBottomMargin,
      this.width,
      this.height - amount
    );
  }

  bound(boundingBox: Viewbox): Viewbox {
    return new Viewbox(
      Math.max(
        this.xMax > boundingBox.xMax
          ? boundingBox.xMax - this.width
          : this.xMin,
        boundingBox.xMin
      ),

      Math.max(
        this.yMax > boundingBox.yMax
          ? boundingBox.yMax - this.height
          : this.yMin,
        boundingBox.yMin
      ),

      Math.min(this.width, boundingBox.width),
      Math.min(this.height, boundingBox.height)
    );
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
