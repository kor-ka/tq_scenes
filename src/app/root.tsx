import * as React from 'react';
import { Horizontal, Vertical, Button, SceneEditor } from './editor';
import { Builder } from './builder';
import Glamorous from '../../node_modules/glamorous';
import { Scenes } from './app';

const accentColor = '#3E5C6B';

export const TabButton = Glamorous(Button)(props => ({
    minHeight: 40,
    color: 'white',
    backgroundColor: accentColor,
    ':hover': {
        backgroundColor: 'white',
        color: accentColor,
    },
    ':disabled': {
        backgroundColor: 'white',
        color: accentColor
    }

}));

const RootSidebar = Glamorous(Vertical)({
    backgroundColor: accentColor,
});

const BuilderStyled = Glamorous(Builder)({
    width: 'calc(100% - 74px)'
});

export class Root extends React.Component<{}, {
    tab: 'builder' | 'editor',
    scenes: any,
}>{
    constructor(props: {}) {
        super(props);
        let savedState = JSON.parse(window.localStorage.getItem('rootState'));

        //initial scenes state
        // TODO load initial scenes if none
        let scenes = JSON.parse(window.localStorage.getItem('scenes')) || {};

        this.state = { tab: 'builder', ...(savedState || {}), scenes: scenes };
    }
    componentDidUpdate() {
        window.localStorage.setItem('rootState', JSON.stringify(this.state));
    }

    scenesUpdated = (scenes: any) => {
        this.setState({
            scenes: scenes
        });
    }

    render() {
        return (
            <Horizontal divider={0} height="100%" >
                <RootSidebar padding="16px">
                    <TabButton color="white" onClick={() => this.setState({ tab: "builder" })} disabled={this.state.tab === 'builder'} active={true}><i className="material-icons">call_split</i></TabButton>
                    <TabButton color="white" onClick={() => this.setState({ tab: "editor" })} disabled={this.state.tab === 'editor'} active={true}><i className="material-icons">photo</i></TabButton>
                </RootSidebar>
                <Scenes.Provider value={this.state.scenes}>
                    {this.state.tab === 'builder' && <BuilderStyled />}
                </Scenes.Provider>
                {this.state.tab === 'editor' && <SceneEditor onChanged={this.scenesUpdated} />}
            </Horizontal>
        );
    }
}