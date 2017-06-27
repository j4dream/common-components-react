import React from 'react';
import ReactDOM from 'react-dom';
import Preview from './Preview';

export default function PreviewCenter(props = {}) {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const components = React.createElement(Preview, Object.assign({}, props));

  ReactDOM.render(components, div);
}
