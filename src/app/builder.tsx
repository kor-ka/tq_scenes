import * as React from 'react';
import Glamorous from 'glamorous';
import { Vertical } from './editor';

interface StoryState {
    story: Content[];
    vars: { [key: string]: string | number };
    currentReaction?: Content;
    nextEpisodeId: string;
}

type ContentType = 'text' | 'image';

let lastId = new Date().getTime();
const getId = () => {
    lastId += 1;
    return lastId;
}

class Content {
    id: string;
    type: ContentType;
    name?: string;
    constructor(type: ContentType, id: string, name?: string) {
        this.id = id;
        this.type = type;
        this.name = name;
    }
}

class TextContent extends Content {
    text: string;
    constructor(text?: string, name?: string) {
        super('text', 'content_text_' + getId(), name);
        this.text = text;
    }
}

class ImageContent extends Content {
    src: string;
    constructor(src?: string, name?: string) {
        super('image', 'content_image_' + getId(), name);
        this.src = src;
    }
}

type ConditionType = 'varEquals';

class Condition {
    type: ConditionType;
    constructor(type: ConditionType) {
        this.type = type;
    }
}

class VarEqualsCondition extends Condition {
    type: ConditionType;
    constructor() {
        super('varEquals')
    }
}

type ActionType = 'setVar' | 'increment' | 'decriment';

class Action {
    type: ActionType;
    condition?: Condition;
    constructor(type: ActionType, condition?: Condition) {
        this.type = type;
        this.condition = condition;
    }
}

class SetVarAction extends Action {
    type: ActionType;
    constructor(condition?: Condition) {
        super('setVar', condition)
    }
}

class IncrementAction extends Action {
    type: ActionType;
    constructor(condition?: Condition) {
        super('increment', condition)
    }
}

class DecrimentAction extends Action {
    type: ActionType;
    constructor(condition?: Condition) {
        super('decriment', condition)
    }
}

type ReactionType = 'closed_text' | 'open_text';
class Reaction {
    id: string;
    type: ReactionType;
    nextEpisode?: string;
    constructor(type: ReactionType, nextEpisode?: string) {
        this.id = 'reaction_' + getId();
        this.type = type;
        this.nextEpisode = nextEpisode;
    }
}

class ReactionClosedText extends Reaction {
    title: string;
    constructor(title: string, nextEpisode?: string) {
        super('closed_text', nextEpisode);
        this.title = title;
    }
}

class Episode {
    id: string;
    name: string;
    defaultContent: Content;
    contentReasolvers?: { condition: Condition, content: Content }[];
    reactionReasolvers: { condition?: Condition, reaction: Reaction, actions?: Action[] }[];
    sceneId?: string;
    constructor(name: string, defaultNextEpisode?: string) {
        this.name = name;
        this.id = 'episode_' + getId();
        this.defaultContent = new TextContent('Hi there')
        this.reactionReasolvers = [{ reaction: new ReactionClosedText('dummy', defaultNextEpisode) }];
    }
}

class Chapter {
    id: string;
    name: string;
    map: { [episodeId: string]: { x: number, y: number, episode: Episode } } = {};
    root: Episode;
    dummy = () => {
        this.root = new Episode('root');

        let parent = this.root;
        for (let i = 0; i < 20; i++) {
            let episode = new Episode('dummy_' + i);
            parent.reactionReasolvers.push({ reaction: new ReactionClosedText('to_' + episode.name, episode.id) })
            if (i % 3 === 0) {
                parent = episode
            }
            this.map[episode.id] = { episode: episode, x: 0, y: 0 };
        }

        return this;

    }

    constructor() {
        this.id = 'chapter_' + getId();
    }

    layout = () => {
        let references: { [key: string]: any } = {};

        // default layout
        let nextLayer = [{ element: this.root, layer: 0, order: 0 }];
        let lastLayer = 0;
        let nextLayerOrder = 0;
        while (nextLayer.length !== 0) {
            let node = nextLayer.shift();
            //prevent loop reference
            if (references[node.element.id]) {
                continue;
            }
            references[node.element.id] = node.element;

            nextLayerOrder = lastLayer === node.layer ? nextLayerOrder : node.order;
            for (let reaction of node.element.reactionReasolvers) {
                if (reaction.reaction.nextEpisode) {

                    let target = this.map[reaction.reaction.nextEpisode].episode;
                    if (target) {
                        nextLayer.push({ element: target, layer: node.layer + 1, order: nextLayerOrder++ });
                    }

                }
            }
            this.map[node.element.id] = { y: node.order, x: node.layer, episode: node.element };

            lastLayer = node.layer;

        }

        return this;
    }

}

const episodeBorder = 1;
const EpisodeDiv = Glamorous(Vertical)({
    border: `${episodeBorder}px solid black`,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
});
class EpisodeComponent extends React.Component<{ episode: Episode }>{
    element?: HTMLElement;
    onEpisodeCreated = (e: HTMLElement) => {
        this.element = e;
    }

    render() {
        return (
            <EpisodeDiv innerRef={this.onEpisodeCreated} className={(this.props as any).className}>
                {this.props.episode.name}
            </EpisodeDiv>
        );
    }
}

const gridGap = 40;
const Grid = Glamorous.div<{ w: number, h: number }>((props) => ({
    display: 'grid',
    justifyContent: 'start',
    alignContent: 'start',
    width: props.w,
    height: props.h,
    gridGap: gridGap,
    marginLeft: 1,
    marginTop: 1,
    gridAutoRows: episodeHeight,
    gridAutoColumns: episodeWidth,
}));

const episodeWidth = 100;
const episodeHeight = 100;

const ChapterItem = Glamorous(EpisodeComponent)<{ x: number, y: number }>((props) => ({
    gridColumn: props.x,
    gridRow: props.y,
    width: episodeWidth,
    height: episodeHeight
}));

class ChapterState {
    rows: number;
    columns: number;
}


class ChapterComponent extends React.Component<{ chapter: Chapter }, ChapterState>{
    maxX = 0;
    maxY = 0;
    constructor(props: any) {
        super(props);
        let e;
        for (let eKey of Object.keys(this.props.chapter.map)) {
            e = this.props.chapter.map[eKey];
            this.maxX = Math.max(this.maxX, e.x);
            this.maxY = Math.max(this.maxY, e.y);
        }

        this.state = {
            rows: this.maxX + 100,
            columns: this.maxY + 100
        }
    }

    renderLines = () => {
        let lines = [];
        for (let eKey of Object.keys(this.props.chapter.map)) {
            let from = this.props.chapter.map[eKey];
            for (let reactionResolver of from.episode.reactionReasolvers) {
                if (reactionResolver.reaction.nextEpisode) {
                    let to = this.props.chapter.map[reactionResolver.reaction.nextEpisode];
                    let rectFrom = {
                        left: ((from.x) * (episodeWidth + gridGap)) + 2,
                        right: ((from.x) * (episodeWidth + gridGap)) + 2 + episodeWidth,
                        top: ((from.y) * (episodeHeight + gridGap)) + 2,
                        bottom: ((from.y) * (episodeHeight + gridGap)) + 2 + episodeHeight,
                    };

                    let rectTo = {
                        left: ((to.x) * (episodeWidth + gridGap)) + 2,
                        right: ((to.x) * (episodeWidth + gridGap)) + 2 + episodeWidth,
                        top: ((to.y) * (episodeHeight + gridGap)) + 2,
                        bottom: ((to.y) * (episodeHeight + gridGap)) + 2 + episodeHeight,
                    };

                    let xf = to.x === from.x ? (rectFrom.left + (rectFrom.right - rectFrom.left) / 2) : to.x > from.x ? rectFrom.right : rectFrom.left;
                    let yf = (xf === rectFrom.right || xf === rectFrom.left || to.y === from.y) ? (rectFrom.top + (rectFrom.bottom - rectFrom.top) / 2) : to.y > from.y ? rectFrom.bottom : rectFrom.top;

                    let xt = from.x === to.x ? (rectTo.left + (rectTo.right - rectTo.left) / 2) : from.x > to.x ? rectTo.right : rectTo.left;
                    let yt = (xt === rectTo.right || xt === rectTo.left || from.y === to.y) ? (rectTo.top + (rectTo.bottom - rectTo.top) / 2) : from.y > to.y ? rectTo.bottom : rectTo.top;

                    let xm1 = xf + Math.abs(xf - xt) / 2;
                    let ym1 = yf;

                    let xm2 = xf + Math.abs(xf - xt) / 2;;
                    let ym2 = yt;


                    lines.push(<polyline key={'connect_' + from.episode.id + '_' + to.episode.id} points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2}  ${xt} ${yt}`} fill="none" style={{ stroke: 'blue', strokeWidth: 10, opacity: 0.5 }} />);
                }
            }
        }

        return lines;
    }

    render() {
        let items = [];
        for (let ekey of Object.keys(this.props.chapter.map)) {
            let e = this.props.chapter.map[ekey];
            items.push(<ChapterItem key={e.episode.id} episode={e.episode} x={e.x + 1} y={e.y + 1} />);
        }

        let w = this.state.columns * episodeWidth + (this.state.columns - 1) * gridGap;
        let h = this.state.rows * episodeHeight + (this.state.rows - 1) * gridGap;

        return (

            <div style={{ overflowY: 'scroll', overflowX: 'scroll', position: 'relative' }} className={(this.props as any).className}>
                <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    width: w,
                    height: h,
                    backgroundImage: 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/grid.png)',
                    backgroundSize: '16px 16px'
                }}>
                    {this.renderLines()}
                </svg>
                <Grid w={w} h={h}>
                    {items}
                </Grid>

            </div>

        );
    }
}

const ChapterStyled = Glamorous(ChapterComponent)({
    height: '80%'
});

interface BuilderState {
    timeLine: Chapter[],
    selectedChapter: 0,
}

export class Builder extends React.Component<{}, BuilderState>{
    episodesComponents: { [id: string]: EpisodeComponent } = {};
    lines = [];
    layoutChangeTimeout: any;
    gridNode?: Element;
    layout;
    episodeDivs;

    constructor(props: any) {
        super(props);
        this.state = {
            timeLine: [new Chapter().dummy().layout()],
            selectedChapter: 0,
        }
    }

    render() {
        console.warn('render!')
        return (
            <Vertical height='100vh' >
                <ChapterStyled chapter={this.state.timeLine[this.state.selectedChapter]} />
            </ Vertical>
        )
    }
}