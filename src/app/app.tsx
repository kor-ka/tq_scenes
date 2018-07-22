import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SceneEditor } from './editor';
import { SceneComponent } from './scene';
import { Builder } from './builder';
import { Root } from './root';
import { ScenePicker } from './scenePicker';
ReactDOM.render(
  <Root />,
  document.getElementById("root")
);