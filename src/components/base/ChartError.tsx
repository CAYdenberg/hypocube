import React from 'react';
import { Props } from './Chart';

const ChartError: React.FC<Props> = (props) => {
  return (
    <div
      style={{
        height: props.height,
        background: '#ccc',

        padding: '1rem',
        fontSize: '1.4rem',
        color: 'red',
        marginBottom: '1rem',
      }}
    >
      &#x26A0;&emsp;Unable to render chart
    </div>
  );
};

export default ChartError;
