import * as React from 'react';
import { Horizontal, Vertical, Button, SceneEditor } from './editor';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { BuilderRoot } from './builderRoot';

export class Root extends React.PureComponent {
    render() {
        return (
            <>
                <Route path="/edit" component={BuilderRoot}/>
            </>
        );
    }
}