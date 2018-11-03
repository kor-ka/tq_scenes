import * as React from 'react';
import { Horizontal, Vertical, Button, SceneEditor } from './editor';
import { Builder, Episode } from './builder';
import Glamorous from '../../node_modules/glamorous';
import { Scenes } from './app';
import { Player } from './player';
import * as template from './template.json';

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

const PlayerStyled = Glamorous(Player)({
    width: 'calc(100% - 74px)'
});

export class BuilderRoot extends React.Component<{}, {
    tab: 'builder' | 'editor' | 'player',
    scenes: any,
    episodes: { eMap: { [key: string]: Episode }, root: string },
}>{
    constructor(props: {}) {
        super(props);
        let savedState = null;
        // let savedState = JSON.parse(window.localStorage.getItem('rootState'));


        if (!savedState) {
            savedState = template;
            window.localStorage.setItem('rootState', JSON.stringify(savedState));
            console.warn(savedState)
        }

        this.state = { tab: 'builder', ...savedState };
    }

    componentDidUpdate() {
        window.localStorage.setItem('rootState', JSON.stringify(this.state));
    }

    scenesUpdated = (scenes: any) => {
        this.setState({
            scenes: scenes
        });
    }
    episodesUpdated = (episodes: any) => {
        console.warn(episodes);
        this.setState({
            episodes: episodes
        });
    }

    render() {
        return (
            <Horizontal divider={0} height="100%" >
                <RootSidebar padding="16px">
                    <TabButton color="white" onClick={() => this.setState({ tab: "builder" })} disabled={this.state.tab === 'builder'} active={true}><i className="material-icons">call_split</i></TabButton>
                    <TabButton color="white" onClick={() => this.setState({ tab: "editor" })} disabled={this.state.tab === 'editor'} active={true}><i className="material-icons">photo</i></TabButton>
                    {this.state.episodes && <TabButton color="white" onClick={() => this.setState({ tab: "player" })} disabled={this.state.tab === 'player'} active={true}><i className="material-icons">play_arrow</i></TabButton>}
                </RootSidebar>
                <Scenes.Provider value={this.state.scenes}>
                    {this.state.tab === 'builder' && <BuilderStyled onChanged={this.episodesUpdated} />}
                    {this.state.tab === 'player' && <PlayerStyled eMap={this.state.episodes.eMap} root={this.state.episodes.root} />}
                </Scenes.Provider>
                {this.state.tab === 'editor' && <SceneEditor onChanged={this.scenesUpdated} />}
            </Horizontal>
        );
    }
}