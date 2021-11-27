import deepFreeze from 'deep-freeze';
import { Point } from '../../types';
import Viewbox, { createViewboxFromData } from '../Viewbox';

const initial = new Viewbox(5, 50, 10, 15);
deepFreeze(initial);

describe('Viewbox', () => {
  it('sets up a viewbox', () => {
    expect(initial).toHaveProperty('xMax', 15);
    expect(initial).toHaveProperty('yMax', 65);
  });

  describe('toPath', () => {
    it('gets the rectangular path of the viewbox', () => {
      const path = initial.toPath();
      expect(path).toEqual([
        [5, 50],
        [15, 50],
        [15, 65],
        [5, 65],
      ]);
    });
  });

  describe('panX', () => {
    it('slides the view right', () => {
      const result = initial.panX(5);
      expect(result).toHaveProperty('xMin', 10);
      expect(result.width).toEqual(initial.width);
    });
  });

  describe('panY', () => {
    it('slides the view down', () => {
      const result = initial.panY(-5);
      expect(result).toHaveProperty('yMin', 45);
      expect(result.height).toEqual(initial.height);
    });
  });

  describe('zoom', () => {
    it('zooms in to 200% of the original size', () => {
      const result = initial.zoom(2);
      expect(result).toHaveProperty('width', 5);
      expect(result).toHaveProperty('xMin', 7.5);
      expect(result).toHaveProperty('height', 7.5);
    });
    it('zooms out to 50% of the original size', () => {
      const result = initial.zoom(0.5);
      expect(result).toHaveProperty('width', 20);
      expect(result).toHaveProperty('height', 30);
    });
    it('preserves the anchor point', () => {
      const result = initial.zoom(2, [5, 50]);
      expect(result).toHaveProperty('width', 5);
      expect(result).toHaveProperty('height', 7.5);
      expect(result.xMin).toEqual(initial.xMin);
      expect(result.yMin).toEqual(initial.yMin);
    });
    it('never changes if the factor is 1', () => {
      const result = initial.zoom(1, [5, 50]);
      expect(result.hash).toEqual(initial.hash);
    });
  });

  describe('interpolate', () => {
    it('produces a viewbox partway in between the starting and ending points', () => {
      const final = new Viewbox(10, 50, 20, 15);
      const result = initial.interpolate(final, 0.5);
      expect(result.y).toEqual(initial.y);
      expect(result.xMin).toEqual(7.5);
      expect(result.width).toEqual(15);
    });

    it('produces the initial viewbox before it starts', () => {
      const final = new Viewbox(10, 50, 20, 15);
      const result = initial.interpolate(final, 0);
      expect(result).toEqual(initial);
    });

    it('produces the final viewbox once progress is finished', () => {
      const final = new Viewbox(10, 50, 20, 15);
      const result = initial.interpolate(final, 1);
      expect(result).toEqual(final);
    });
  });

  describe('bound', () => {
    it('pans the viewbox so that it can be enitrely contained within the bounding box', () => {
      const boundingBox = new Viewbox(0, 50, 20, 15);
      const result = initial
        .panX(-100)
        .panY(500)
        .bound(boundingBox);
      expect(result.xMin).toEqual(boundingBox.xMin);
      expect(result.width).toEqual(initial.width);
      expect(result.yMax).toEqual(boundingBox.yMax);
      expect(result.height).toEqual(initial.height);
    });

    it('returns the bounds of the bounding box if the width cannot be preserved', () => {
      const boundingBox = new Viewbox(5, 55, 10, 5);
      const result = initial.bound(boundingBox);
      expect(result.height).toEqual(boundingBox.height);
      expect(result.yMin).toEqual(boundingBox.yMin);
      expect(result.yMax).toEqual(boundingBox.yMax);
    });
  });

  describe('constrainZoom', () => {
    it('returns the initial view if the constraints are met', () => {
      const result = initial.constrainZoom({
        maxZoomX: 10,
        maxZoomY: 15,
      });
      expect(result.hash).toEqual(initial.hash);
    });

    it('should back out if the view is too zoomed in', () => {
      const result = initial.constrainZoom({
        maxZoomX: 15,
        maxZoomY: 15,
      });
      expect(result.width).toEqual(15);
      expect(result.xMin).toEqual(2.5);
    });

    it('backs out in one dimension if the constraints in that dimension are not met', () => {
      const result = initial.constrainZoom({
        maxZoomX: 15,
        maxZoomY: 1,
      });
      expect(result.width).toEqual(15);
      expect(result.height).toEqual(initial.height);
      expect(result.yMin).toEqual(initial.yMin);
    });

    it('backs out in one dimension if the constraints in that dimension are not met', () => {
      const result = initial.constrainZoom({
        maxZoomX: 1,
        maxZoomY: 30,
      });
      expect(result.width).toEqual(initial.width);
      expect(result.xMin).toEqual(initial.xMin);
      expect(result.height).toEqual(30);
    });

    it('ignores zero values and returns the original', () => {
      const result = initial.constrainZoom({
        maxZoomX: 0,
        maxZoomY: 0,
      });
      expect(result.hash).toEqual(initial.hash);
    });
  });
});

describe('createViewboxFromData', () => {
  const data: Point[] = [
    [-1, 0],
    [-1, 1],
    [0, 2],
    [4, 7],
    [4, 7],
    [4, 7],
    [5, 3],
    [6, 4],
    [6, 5],
  ];

  it('finds the extremes of a series', () => {
    const view = createViewboxFromData(data);
    expect(view).toHaveProperty('xMin', -1);
    expect(view).toHaveProperty('xMax', 6);
    expect(view).toHaveProperty('yMin', 0);
    expect(view).toHaveProperty('yMax', 7);
  });

  it('finds the extremes of a dataseries', () => {
    const dataseries = [
      {
        data,
        key: 'mydata',
      },
    ];

    const view = createViewboxFromData(dataseries);
    expect(view).toHaveProperty('xMin', -1);
    expect(view).toHaveProperty('xMax', 6);
    expect(view).toHaveProperty('yMin', 0);
    expect(view).toHaveProperty('yMax', 7);
  });
});
