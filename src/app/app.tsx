import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SceneEditor } from './editor';
import { SceneComponent } from './scene';
import { Builder } from './builder';
ReactDOM.render(
  <Builder />,
  // <SceneEditor />,
  document.getElementById("root")
);