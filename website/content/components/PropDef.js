import * as React from 'react';
import styled from '@emotion/styled';

export default ({ name, type, required, children, def }) => {
  return (
    <Prop id={`prop-${name}`}>
      <PropName>{name}</PropName>
      {required ? <IsRequired>(required)</IsRequired> : null}
      {type ? <PropType>{type}</PropType> : null}
      <PropDescription>{children}</PropDescription>
      {def ? (
        <DefContainer>
          <DefLabel>Default:</DefLabel>
          <DefVal>{def}</DefVal>
        </DefContainer>
      ) : null}
    </Prop>
  );
};

const Prop = styled('div')`
  font-family: Roboto, sans-serif;
  color: rgb(59, 69, 78);
  margin-bottom: 1.5em;
`;

const PropName = styled('span')`
  font-family: monospace;
  background: #eee;
  font-size: 1.1em;
  margin-right: 0.5em;
  padding: 0 0.33em;
`;

const IsRequired = styled('span')`
  font-style: italic;
  margin-right: 0.5em;
`;

const PropType = styled('span')`
  font-family: monospace;
`;

const PropDescription = styled('div')`
  padding-left: 2em;
  line-height: 1.33;
`;

const DefContainer = styled('div')`
  padding-left: 2em;
  line-height: 1.33;
`;

const DefLabel = styled('span')`
  font-style: italic;
  margin-right: 0.5em;
`;

const DefVal = styled('span')`
  font-family: monospace;
  background: #eee;
  padding: 0 0.33em;
`;
