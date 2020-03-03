const { configure } = require('@storybook/react');

const req = require.context('../src/components/__stories__', true, /\.tsx/);

configure(() => {
  req.keys().forEach(filename => req(filename));
}, module);
