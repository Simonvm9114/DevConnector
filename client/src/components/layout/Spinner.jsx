import React, { Fragment } from 'react';
import spinner from './spinner.gif';

function Spinner(props) {
  return (
    <Fragment>
      <img
        src={spinner}
        style={{ width: '64px', margin: 'auto', display: 'block' }}
        alt='Loading...'
      />
    </Fragment>
  );
}

export default Spinner;