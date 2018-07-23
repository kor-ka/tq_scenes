import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root } from './root';
import { Polygon, Animation } from './editor';

export const Scenes = React.createContext<{ [id: string]: { polygons: Polygon[], animations: Animation[] } }>({});

ReactDOM.render(
  <Root />,
  document.getElementById("root")
);