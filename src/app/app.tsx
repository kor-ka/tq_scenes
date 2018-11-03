import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BuilderRoot } from './builderRoot';
import { Polygon, Animation } from './editor';

export const Scenes = React.createContext<{ [id: string]: { polygons: Polygon[], animations: Animation[] } }>({});

ReactDOM.render(
  <BuilderRoot />,
  document.getElementById("root")
);