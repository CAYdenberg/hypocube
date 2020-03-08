import { storiesOf } from '@storybook/react';
import React from 'react';
import Reactscape from '../Reactscape';
import Shape from '../Shape';

storiesOf('container component', module)
  .add('basic', () => (
    <Reactscape pxHeight={900}>
      <Shape />
    </Reactscape>
  ))
  .add('with canvas', () => (
    <Reactscape pxHeight={900} useCanvas>
      <Shape />
    </Reactscape>
  ));
