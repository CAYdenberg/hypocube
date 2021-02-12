import examples from './stories';
import renderer from 'react-test-renderer';

examples.forEach(eg => {
  test(`Test: ${eg.name}`, () => {
    const output = renderer.create(eg.render({ isCanvas: false }));
    expect(output).toMatchSnapshot();
  });
});
