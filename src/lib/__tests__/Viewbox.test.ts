import Viewbox from '../Viewbox';

describe('Viewbox', () => {
  const initial = new Viewbox(5, 50, 10, 15);

  it('sets up a viewbox', () => {
    expect(initial).toHaveProperty('xMax', 15);
    expect(initial).toHaveProperty('yMax', 65);
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

  describe('zoomX', () => {
    it('zooms out on the x axis', () => {
      const result = initial.zoomX(-5);
      expect(result).toHaveProperty('xMin', 2.5);
      expect(result).toHaveProperty('xMax', 17.5);
    });
  });

  describe('zoomY', () => {
    it('zooms out on the y axis', () => {
      const result = initial.zoomY(-5, 0);
      expect(result.yMin).toEqual(initial.yMin);
      expect(result).toHaveProperty('yMax', 70);
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
});
