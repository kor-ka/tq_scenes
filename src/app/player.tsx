import * as React from 'react';
import Glamorous from 'glamorous';
import { Vertical } from './editor';
import { Scene } from './scenePicker';
import { Episode, ContentRender, Condition, ConditionEquals, ConditionGreather, ConditionLess, Content, Reaction, Action } from './builder';
import { inRange, valid } from '../../node_modules/glamor';

const SceneBackground = Glamorous(Scene)({
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
});

const ContentRenderMargin = Glamorous(ContentRender)({
    margin: 8,
});


class EpisodeRender extends React.Component<{ episode: { sceneId: string, content: Content[], reactions: Reaction[] }, onRreaction: (reaction: Reaction) => void }>{
    render() {

        return (
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} >
                <SceneBackground id={this.props.episode.sceneId} raw={true} fill={true} blur={true} animated={true} />
                <Vertical key={this.props.episode.sceneId} style={{ position: 'absolute', left: 0, top: 0, padding: 0, height: '100%', overflowX: 'hidden' }} scrollable={true}>
                    <Vertical style={{ flexGrow: 1, padding: 16, paddingBottom: 0, alignItems: 'flex-start' }}>
                        {this.props.episode.content.map(c => <ContentRender content={c} />)}
                    </Vertical>
                    <div style={{ flexWrap: 'wrap', display: 'flex', marginLeft: -8, marginRight: -8, padding: 16, paddingBottom: 8, paddingTop: 0, flexShrink: 0 }} >
                        {this.props.episode.reactions.map(c => <ContentRenderMargin content={c} onClick={() => this.props.onRreaction(c)} />)}
                    </div>

                </Vertical>
            </div>
        )
    }
}

interface PlayerProps {
    root: string;
    eMap: { [key: string]: Episode };
}
interface PlayerState {
    currentErisode: string,
    vars: { [key: string]: string }
}

const checkCondition: (state: { [key: string]: string }, condition?: Condition) => boolean = (state: { [key: string]: string }, condition?: Condition) => {
    console.warn('checking: ', state, condition)
    if (!condition) {
        return true;
    }

    if (condition.type === 'equals') {
        let eq: ConditionEquals = condition as ConditionEquals;
        return (state[eq.target] || '') === eq.ethalon
    }

    if (condition.type === 'greater') {
        let eq: ConditionEquals = condition as ConditionGreather;
        return Number(state[eq.target]) > Number(eq.ethalon)
    }

    if (condition.type === 'less') {
        let eq: ConditionEquals = condition as ConditionLess;
        return Number(state[eq.target]) < Number(eq.ethalon)
    }

    return false;
}

const applyAction = (state: { [key: string]: string }, action: Action) => {
    console.warn('applying: ', state, action);
    if (action.type === 'set') {
        state[action.target] = action.value;
    }
    if (action.type === 'increment') {
        let res = Number(state[action.target]) || 0;
        state[action.target] = String(res + Number(action.value) || 0);
    }
    if (action.type === 'decriment') {
        let res = Number(state[action.target]) || 0;
        state[action.target] = String(res - Number(action.value) || 0);
    }
    return state;
}
export class Player extends React.Component<PlayerProps, PlayerState>{
    id: string;
    constructor(props: PlayerProps) {
        super(props);
        this.id = window.location.pathname.split('/').filter(s => s.length)[0];
        let strVars = window.localStorage.getItem('play_state_' + this.id);
        this.state = strVars ? JSON.parse(strVars) : {
            currentErisode: props.root,
            vars: {}
        }
    }

    onReaction = (reaction: Reaction) => {
        let episode = this.props.eMap[this.state.currentErisode];
        let actions = episode.reactionReasolvers.filter(r => r.reaction.id === reaction.id)[0].actions || [];
        let vars = { ...this.state.vars };
        for (let action of actions) {
            vars = applyAction(vars, action);
        }
        console.warn(reaction);
        this.setState({
            currentErisode: reaction.nextEpisode || this.state.currentErisode,
            vars: vars,
        })
    }

    componentDidUpdate() {
        window.localStorage.setItem('play_state_' + this.id, JSON.stringify(this.state))
    }

    render() {
        let episode = this.props.eMap[this.state.currentErisode];
        let content = episode.contentReasolvers.filter(entry => checkCondition(this.state.vars, entry.condition)).map(entry => entry.content);
        let reactions = episode.reactionReasolvers.filter(entry => checkCondition(this.state.vars, entry.condition)).map(entry => entry.reaction);

        return (
            <EpisodeRender episode={{ sceneId: episode.sceneId, content: content, reactions: reactions }} onRreaction={this.onReaction} />
        );
    }
}