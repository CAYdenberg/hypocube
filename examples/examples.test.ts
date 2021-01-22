import examples from './examples';
import renderer from 'react-test-renderer';

examples.forEach((eg) => {
  test(`Test: ${eg.name}`, () => {
    const output = renderer.create(eg.render({ isCanvas: false }));
    expect(output).toMatchSnapshot();
  });
});
