import { storiesOf } from '@storybook/react';
import React from 'react';
import Reactscape from '../Reactscape';
import Shape from '../Shape';

storiesOf('container component', module)
  .add('basic', () => (
    <Reactscape>
      <Shape />
    </Reactscape>
  ))
  .add('with canvas', () => (
    <Reactscape useCanvas>
      <Shape />
    </Reactscape>
  ));
