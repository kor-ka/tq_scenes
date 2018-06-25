import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as glamor from 'glamor';
import Glamorous from 'glamorous';
import { Vertical } from './editor';
import * as ReactGridLayout from 'react-grid-layout';

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
    name?: string;
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

class TimeLine {
    map: { [episodeId: string]: { x: number, y: number, w: number, h: number, episode: Episode } }
    root: Episode;
    constructor() {
        let dummy = new Episode('dummy');
        this.root = new Episode('root', dummy.id);

        let dummy2 = new Episode('dummy2');
        this.root.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy2', dummy2.id) });

        let dummy3 = new Episode('dummy3');
        this.root.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy3', dummy3.id) });


        let dummy4 = new Episode('dummy4');
        dummy3.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy4', dummy4.id) });

        let dummy5 = new Episode('dummy5');
        dummy3.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy5', dummy5.id) });

        let dummy6 = new Episode('dummy6');
        dummy5.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy6', dummy6.id) });

        let dummy7 = new Episode('dummy7');
        dummy5.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy7', dummy7.id) });

        let dummy8 = new Episode('dummy8');
        dummy5.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy8', dummy8.id) });

        let dummy9 = new Episode('dummy9');
        dummy5.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy9', dummy9.id) });

        let dummy10 = new Episode('dummy10');
        dummy4.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy10', dummy10.id) });

        let dummy11 = new Episode('dummy11');
        dummy4.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy11', dummy11.id) });

        let dummy12 = new Episode('dummy12');
        dummy4.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy12', dummy12.id) });

        let dummy13 = new Episode('dummy13');
        dummy4.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy13', dummy13.id) });

        let dummy14 = new Episode('dummy14');
        dummy10.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy14', dummy14.id) });

        let dummy15 = new Episode('dummy15');
        dummy10.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy15', dummy15.id) });

        let dummy16 = new Episode('dummy16');
        dummy10.reactionReasolvers.push({ reaction: new ReactionClosedText('dummy16', dummy16.id) });

        dummy16.reactionReasolvers.push({ reaction: new ReactionClosedText('root', this.root.id) });


        let episodes = [this.root, dummy, dummy2, dummy3, dummy4, dummy5, dummy6, dummy7, dummy8, dummy9, dummy10, dummy11, dummy12, dummy13, dummy14, dummy15, dummy16];

        this.map = {};

        let references: { [key: string]: any } = {};

        // default layout
        let w = 2;
        let h = 2;
        let nextLayer = [{ element: this.root, layer: 0, x: 0 }];
        let lastLayer = 0;
        let nextLayerX = 0;
        while (nextLayer.length !== 0) {
            let node = nextLayer.shift();
            //prevent loop reference
            if (references[node.element.id]) {
                continue;
            }
            references[node.element.id] = node.element;

            nextLayerX = lastLayer === node.layer ? nextLayerX : 0;
            for (let reaction of node.element.reactionReasolvers) {
                if (reaction.reaction.nextEpisode) {

                    let target = episodes.filter(e => e.id === reaction.reaction.nextEpisode)[0];
                    console.warn(reaction.reaction.nextEpisode, references[reaction.reaction.nextEpisode]);
                    if (target) {
                        nextLayer.push({ element: target, layer: node.layer + 1, x: nextLayerX++ });
                    }

                }
            }
            this.map[node.element.id] = { x: node.x * w + nextLayerX, y: node.layer * h * 1.5, w: w, h: h, episode: node.element };

            lastLayer = node.layer;

        }

    }

}

interface BuilderState {
    timeLine: TimeLine
    windowHeight: number,
    windowWidth: number,
    timelineHeight: number,
    episodesComponents: { [id: string]: EpisodeComponent }
    lines: HTMLElement[];
    layout: ReactGridLayout.Layout[]
}

const EpisodeDiv = Glamorous(Vertical)({
    border: '1px solid black',
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
            <EpisodeDiv innerRef={this.onEpisodeCreated}>
                {this.props.episode.name}
            </EpisodeDiv>
        );
    }
}

const Grid = Glamorous(ReactGridLayout)({
});

export class Builder extends React.Component<{}, BuilderState>{
    episodesComponents: { [id: string]: EpisodeComponent } = {};
    lines = [];
    layoutChangeTimeout: any;
    gridNode?: Element;
    constructor(props: any) {
        super(props);
        this.state = {
            timeLine: new TimeLine(),
            timelineHeight: 0,
            episodesComponents: this.episodesComponents,
            lines: this.lines,
            layout: [],
            windowHeight: 0,
            windowWidth: 0
        }
    }

    handleResize = () => {
        this.lines = this.renderLines();
        this.setState({
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        })
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize)
    }

    onEpisosdeCreated = (e: EpisodeComponent) => {
        if (e === null) {
            return;
        }
        this.episodesComponents[e.props.episode.id] = e;

        this.setState({
            episodesComponents: this.episodesComponents
        })
    }

    renderLines = () => {
        let lines = [];
        for (let eKey of Object.keys(this.state.episodesComponents)) {
            let episodeComponent = this.state.episodesComponents[eKey];
            for (let reactionResolver of episodeComponent.props.episode.reactionReasolvers) {
                if (reactionResolver.reaction.nextEpisode) {
                    let target = this.state.episodesComponents[reactionResolver.reaction.nextEpisode];
                    if (target && target.element && episodeComponent.element) {
                        let offset = episodeComponent.element.parentElement.parentElement.parentElement.scrollTop;
                        let rectFrom = episodeComponent.element.getBoundingClientRect();
                        let rectTo = target.element.getBoundingClientRect();

                        if (rectTo.top > rectFrom.top) {
                            let xf = rectFrom.right - rectFrom.width / 2;
                            let yf = rectFrom.bottom + offset;

                            let xt = rectTo.right - rectTo.width / 2;
                            let yt = rectTo.top + offset;


                            let xm1 = rectFrom.right - rectFrom.width / 2;
                            let ym1 = rectFrom.bottom + ((yt - yf) / 2) + offset;

                            let xm2 = xt;
                            let ym2 = ym1;

                            lines.push(<polyline points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2} ${xt} ${yt}`} fill="none" style={{ stroke: 'blue', strokeWidth: rectFrom.width / 10, opacity: 0.5 }} />);

                        } else {
                            let xf = rectFrom.right - rectFrom.width / 2;
                            let yf = rectFrom.bottom + offset;

                            let xt = rectTo.right - rectTo.width / 2;
                            let yt = rectTo.top + offset;


                            let xm1 = xf;
                            let ym1 = yf + rectFrom.height / 10;

                            let xm2 = xm1 + rectFrom.width / 1.5 * (rectFrom.left < rectTo.left ? 1 : -1);
                            let ym2 = ym1;

                            let xm3 = xm2;
                            let ym3 = yt - rectTo.height / 10;

                            let xm4 = xt;
                            let ym4 = ym3;



                            lines.push(<polyline points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2} ${xm3} ${ym3} ${xm4} ${ym4} ${xt} ${yt}`} fill="none" style={{ stroke: 'green', strokeWidth: rectFrom.width / 10, opacity: 0.5 }} />);

                        }








                    }
                }
            }
        }

        return lines;
    }

    onLayoutChange = (layout: ReactGridLayout.Layout[]) => {
        this.layoutChangeTimeout = setTimeout(() => {
            this.onLayoutChangeDelayed(layout);
        })

        this.layoutChangeTimeout = setTimeout(() => {
            this.onLayoutChangeDelayed(layout);
        }, 200)
    }

    onLayoutChangeDelayed = (layout: ReactGridLayout.Layout[]) => {
        this.lines = this.renderLines();
        this.setState({ layout: layout });
        this.updateLinesLayout();
    }

    onGridCreated = (e: ReactGridLayout) => {
        if (e === null) {
            return;
        }
        this.gridNode = ReactDOM.findDOMNode(e)
    }

    updateLinesLayout = () => {
        if (this.gridNode) {
            this.setState({ timelineHeight: this.gridNode.getBoundingClientRect().height });
        }
    }

    render() {
        var layout = [];
        var episodeComponents = [];

        if (layout.length === 0) {
            for (let eKey of Object.keys(this.state.timeLine.map)) {
                let episodeMaped = this.state.timeLine.map[eKey];
                let { x, y, w, h } = episodeMaped;
                layout.push({ i: episodeMaped.episode.id, x: x, y: y, w: w, h: h });
                episodeComponents.push(
                    <div key={episodeMaped.episode.id}>
                        <EpisodeComponent episode={episodeMaped.episode} ref={this.onEpisosdeCreated} />
                    </div>
                )
            }
        }

        return (
            <Vertical height='100vh' >
                <div style={{ overflowY: 'scroll', height: '60%', position: 'relative' }}>
                    <svg style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: this.state.windowWidth,
                        height: this.state.timelineHeight,
                        backgroundImage: 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/grid.png)',
                        backgroundSize: '16px 16px'
                    }}>
                        {this.lines}
                    </svg>
                    <Grid
                        ref={this.onGridCreated}
                        className="layout"
                        layout={layout}
                        cols={20}
                        rowHeight={30}
                        width={this.state.windowWidth}
                        compactType={null}
                        preventCollision={true}
                        onResize={this.onLayoutChange}
                        onLayoutChange={this.onLayoutChange}
                        onResizeStop={this.onLayoutChange}
                        onDrag={this.onLayoutChange}
                        onDragStop={this.onLayoutChange}>
                        {episodeComponents}

                    </Grid>
                </div>

                <div style={{ backgroundColor: 'gray' }}>
                </div>
            </ Vertical>
        )
    }
}