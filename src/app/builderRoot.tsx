import * as React from 'react';
import { Horizontal, Vertical, Button, SceneEditor, EditorState } from './editor';
import { Builder, Episode, BuilderState } from './builder';
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
    scenes?: any,
    episodes?: BuilderState,
    loading: boolean,
    play: boolean
}>{
    sceneIniital: any;
    saveBounce?: number;
    id: string;
    constructor(props: {}) {
        super(props);
        this.id = window.location.pathname.split('/').filter(s => s.length)[0];
        let play = window.location.pathname.split('/').filter(s => s.length)[1] === 'play';

        fetch('/api/game/get/' + this.id).then(async r => {
            // let savedState = JSON.parse(window.localStorage.getItem('rootState'));
            let savedState = JSON.parse(await r.json());
            // for scene picker, todo: remove
            window.localStorage.setItem('rootState', JSON.stringify(savedState));

            if (!savedState || !savedState.scenes || !savedState.episodes) {
                savedState = template;
                window.localStorage.setItem('rootState', JSON.stringify(savedState));
            }

            this.sceneIniital = savedState.scenes['undefined'];

            this.setState({ ...savedState, loading: false, play: play })
        })

        this.state = { tab: 'builder', loading: true, play: play };


    }

    // export = () => {
    //     let sceneExport = 'data:text/json;charset=utf-8,';
    //     sceneExport += JSON.stringify(this.state);
    //     var encodedUri = encodeURI(sceneExport);
    //     var link = document.createElement('a');
    //     link.setAttribute('href', encodedUri);
    //     link.setAttribute('download', 'untitled_scene' + '.json');
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // }

    componentDidUpdate() {

        // window.localStorage.setItem('rootState', JSON.stringify(this.state));
        if (this.saveBounce) {
            window.clearTimeout(this.saveBounce);
        }
        this.saveBounce = window.setTimeout(async () => {
            await fetch('/api/game/save/' + this.id, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(this.state)
            });
        }, 500);
    }

    scenesUpdated = (scene: EditorState) => {
        let scenes = { ...this.state.scenes };
        scenes[scene.selectedScene] = { ...scene, id: scene.selectedScene }
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
        return !this.state.loading ? this.state.play ? (
            <Scenes.Provider value={this.state.scenes}>
                <Player eMap={this.state.episodes.episodesMap} root={this.state.episodes.root.id} />
            </Scenes.Provider>
        ) : (
                <Horizontal divider={0} height="100%" >
                    <RootSidebar padding="16px">
                        <TabButton color="white" onClick={() => this.setState({ tab: "builder" })} disabled={this.state.tab === 'builder'} active={true}><i className="material-icons">call_split</i></TabButton>
                        <TabButton color="white" onClick={() => this.setState({ tab: "editor" })} disabled={this.state.tab === 'editor'} active={true}><i className="material-icons">photo</i></TabButton>
                        {this.state.episodes && <TabButton color="white" onClick={() => this.setState({ tab: "player" })} disabled={this.state.tab === 'player'} active={true}><i className="material-icons">play_arrow</i></TabButton>}
                    </RootSidebar>
                    <Scenes.Provider value={this.state.scenes}>
                        {this.state.tab === 'builder' && <BuilderStyled onChanged={this.episodesUpdated} initialState={this.state.episodes} />}
                        {this.state.tab === 'player' && <PlayerStyled eMap={this.state.episodes.episodesMap} root={this.state.episodes.root.id} />}
                    </Scenes.Provider>
                    {this.state.tab === 'editor' && <SceneEditor onChanged={this.scenesUpdated} initialState={this.sceneIniital} />}
                </Horizontal>
            ) : 'loading';
    }
}