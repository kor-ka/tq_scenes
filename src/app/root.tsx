import * as React from 'react';
import { Horizontal, Vertical, Button, SceneEditor } from './editor';
import { Builder } from './builder';
import Glamorous from '../../node_modules/glamorous';

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

export class Root extends React.Component<{}, {
    tab: 'builder' | 'editor',
}>{
    constructor(props: {}) {
        super(props);
        let savedState = JSON.parse(window.localStorage.getItem('rootState'));

        this.state = { tab: 'builder', ...(savedState || {}) };
    }
    componentDidUpdate() {
        window.localStorage.setItem('rootState', JSON.stringify(this.state));
    }
    render() {
        return (
            <Horizontal divider={0} height="100%">
                <RootSidebar padding="16px">
                    <TabButton color="white" onClick={() => this.setState({ tab: "builder" })} disabled={this.state.tab === 'builder'} active={true}><i className="material-icons">call_split</i></TabButton>
                    <TabButton color="white" onClick={() => this.setState({ tab: "editor" })} disabled={this.state.tab === 'editor'} active={true}><i className="material-icons">photo</i></TabButton>
                </RootSidebar>
                {this.state.tab === 'builder' && <Builder />}
                {this.state.tab === 'editor' && <SceneEditor />}
            </Horizontal>
        );
    }
}