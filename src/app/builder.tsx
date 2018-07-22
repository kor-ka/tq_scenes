import * as React from 'react';
import Glamorous from 'glamorous';
import { Vertical, Input, Horizontal, Button, TextArea, Select } from './editor';

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
    constructor(text: string, name?: string) {
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

type ConditionType = 'equals' | 'greater' | 'less' | 'and' | 'or';

class Condition {
    type: ConditionType;
    constructor(type: ConditionType) {
        this.type = type;
    }
}

class ConditionEquals extends Condition {
    type: ConditionType;
    constructor() {
        super('equals')
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

type ReactionType = 'closed_text' | 'open_text' | 'pipe';
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

class ReactionPipe extends Reaction {
    title: string;
    constructor(title: string, nextEpisode?: string) {
        super('pipe', nextEpisode);
        this.title = title;
    }
}

class Episode {
    id: string;
    name: string;
    contentReasolvers: { condition?: Condition, content: Content }[];
    reactionReasolvers: { condition?: Condition, reaction: Reaction, actions?: Action[] }[];
    sceneId?: string;
    constructor() {
        this.id = 'episode_' + getId();
        this.name = 'Episode'
        this.reactionReasolvers = [{ reaction: new ReactionClosedText('Some reaction') }];
        this.contentReasolvers = [{ content: new TextContent('Some text') }];
    }
}

class Chapter {
    id: string;
    name: string;
    map: { [episodeId: string]: { x: number, y: number, episode: Episode } } = {};
    dummy = () => {

        let parent = new Episode();
        for (let i = 0; i < 20; i++) {
            let episode = new Episode();
            episode.name = 'dummy_' + i;
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
        this.name = 'Chapter'
    }

    layout = () => {
        let references: { [key: string]: any } = {};

        // default layout
        let nextLayer = [{ element: this.map[Object.keys(this.map)[0]].episode, layer: 0, order: 0 }];
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
const EpisodeDiv = Glamorous(Vertical)<{ selected: boolean }>((props) => ({
    border: `${episodeBorder}px solid ${props.selected ? 'black' : 'gray'}`,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
}));

const MapsProvider = React.createContext<{ eMap: { [id: string]: { episode: Episode } }, cMap: { [id: string]: { chapter: Chapter } } }>({ eMap: {}, cMap: {} });

class EpisodeComponent extends React.Component<{ episode: Episode, selected: boolean, onClick: () => void }>{
    element?: HTMLElement;
    onEpisodeCreated = (e: HTMLElement) => {
        this.element = e;
    }

    onDragStart = (e) => {
        e.dataTransfer.setData('id', this.props.episode.id);
    }

    render() {
        return (
            <EpisodeDiv onClick={this.props.onClick} draggable={true} selected={this.props.selected} onDragStart={this.onDragStart} innerRef={this.onEpisodeCreated} className={(this.props as any).className}>
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
    // opacity: 0.5,
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

const colors = ['#F55D3E', '#878E88', '#F7CB15', '#FFFFFF', '#76BED0',];
const colors2 = ['#540D6E', '#EE4266', '#F7CB15', '#134074', '#1F271B',];
const hashCode = (s) => {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};
interface ChapterComponentProps {
    chapter: Chapter;
    selectedEpisode: string;
    onChange: (chapterId: string, episodeId: string, x: number, y: number) => void;
    createEpiside: () => void;
    selectEpisode: (id: string) => void;
}
class ChapterComponent extends React.Component<ChapterComponentProps, ChapterState>{
    maxX = 0;
    maxY = 0;
    episodesCordinates: { [coordinates: string]: string } = {};
    constructor(props: any) {
        super(props);

        this.updateMeta(props);

        this.state = {
            rows: this.maxX + 100,
            columns: this.maxY + 100
        }
    }

    componentWillReceiveProps(next: ChapterComponentProps) {
        this.updateMeta(next);
        this.setState({
            rows: this.maxX + 100,
            columns: this.maxY + 100
        });
    }

    updateMeta = (props: ChapterComponentProps) => {
        let e;
        this.episodesCordinates = {};
        for (let eKey of Object.keys(props.chapter.map)) {
            e = props.chapter.map[eKey];
            this.maxX = Math.max(this.maxX, e.x);
            this.maxY = Math.max(this.maxY, e.y);
            this.episodesCordinates[e.x + '_' + e.y] = e.episode.id;
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
                        left: ((from.x) * (episodeWidth + gridGap)) + 2 + gridGap / 2,
                        right: ((from.x) * (episodeWidth + gridGap)) + 2 + episodeWidth + gridGap / 2,
                        top: ((from.y) * (episodeHeight + gridGap)) + 2 + gridGap / 2,
                        bottom: ((from.y) * (episodeHeight + gridGap)) + 2 + episodeHeight + gridGap / 2,
                    };

                    let rectTo = {
                        left: ((to.x) * (episodeWidth + gridGap)) + 2 + gridGap / 2,
                        right: ((to.x) * (episodeWidth + gridGap)) + 2 + episodeWidth + gridGap / 2,
                        top: ((to.y) * (episodeHeight + gridGap)) + 2 + gridGap / 2,
                        bottom: ((to.y) * (episodeHeight + gridGap)) + 2 + episodeHeight + gridGap / 2,
                    };

                    let xf = to.x === from.x ? (rectFrom.left + (rectFrom.right - rectFrom.left) / 2) : to.x > from.x ? rectFrom.right : rectFrom.left;
                    let yf = (xf === rectFrom.right || xf === rectFrom.left || to.y === from.y) ? (rectFrom.top + (rectFrom.bottom - rectFrom.top) / 2) + (to.y === from.y ? 0 : to.y > from.y ? 10 : -10) : to.y > from.y ? rectFrom.bottom : rectFrom.top;

                    let xt = from.x === to.x ? (rectTo.left + (rectTo.right - rectTo.left) / 2) : from.x > to.x ? rectTo.right : rectTo.left;
                    let yt = (xt === rectTo.right || xt === rectTo.left || from.y === to.y) ? (rectTo.top + (rectTo.bottom - rectTo.top) / 2) : from.y > to.y ? rectTo.bottom : rectTo.top;


                    let color = colors2[Math.abs(hashCode(reactionResolver.reaction.id + to.episode.id)) % colors.length];

                    lines.push(<marker key={'arrow_' + from.episode.id + '_' + to.episode.id} id={'arrow_' + from.episode.id + '_' + to.episode.id} markerWidth="3" markerHeight="2" refX="0" refY="0.5" orient={yt === rectTo.top ? '90' : yt === rectTo.bottom ? '270' : 'auto'} markerUnits="strokeWidth">
                        <path d="M0,0 L0,1 L1.5,0.5 z" fill={color} />
                    </marker>);
                    //marker corrections
                    if (yt === rectTo.top) {
                        yt -= 15;
                    }
                    if (yt === rectTo.bottom) {
                        yt += 15;
                    }

                    if (xt === rectTo.left) {
                        xt -= 15;
                    }
                    if (xt === rectTo.right) {
                        xt += 15;
                    }

                    let xm1 = xf - (xf - xt) / 2;
                    let ym1 = yf;

                    let xm2 = xf - (xf - xt) / 2;;
                    let ym2 = yt;

                    // console.warn(hashCode(from.episode.id + to.episode.id) % colors.length);
                    // lines.push(<polyline key={'connect_1' + from.episode.id + '_' + to.episode.id} points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2}  ${xt} ${yt}`} fill="none" style={{ stroke: (colors[Math.abs(hashCode(reactionResolver.reaction.id + to.episode.id)) % colors.length]), strokeWidth: 10, strokeDasharray: '5,5', opacity: 1 }} />);
                    lines.push(<polyline key={'connect_2' + from.episode.id + '_' + to.episode.id} points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2}  ${xt} ${yt}`} fill="none" style={{ stroke: color, strokeWidth: 10, opacity: 0.5 }} markerEnd={`url(#${'arrow_' + from.episode.id + '_' + to.episode.id})`} />);
                }
            }
        }

        return lines;
    }

    dragPlaceholder: HTMLElement;

    onDragPlaceholderCreated = (e) => {
        this.dragPlaceholder = e;
    }

    targetDropX = 0;
    targetDropY = 0;
    onDragOver = (e) => {
        e.preventDefault();

        if (this.dragPlaceholder) {
            let offsetx = e.target.parentElement.scrollLeft;
            let offsety = e.target.parentElement.scrollTop;
            let x = e.clientX + offsetx;
            // ugly fix - find top offset
            let y = e.pageY + offsety - 50;

            x = x - (x % (episodeWidth + gridGap)) + gridGap / 2;
            y = y - (y % (episodeHeight + gridGap)) + gridGap / 2;

            this.targetDropX = Math.round((x - gridGap / 2) / (episodeWidth + gridGap));
            this.targetDropY = Math.round((y - gridGap / 2) / (episodeHeight + gridGap));

            this.dragPlaceholder.style.left = String(x);
            this.dragPlaceholder.style.top = String(y);
            this.dragPlaceholder.style.opacity = '1';
        }
    }

    onDragLeave = (e) => {
        if (this.dragPlaceholder) {
            this.dragPlaceholder.style.opacity = '0';
        }
    }

    onDrop = (e) => {
        if (this.dragPlaceholder) {
            this.dragPlaceholder.style.opacity = '0';
        }
        if (this.episodesCordinates[this.targetDropX + '_' + this.targetDropY]) {
            return;
        }
        this.props.onChange(this.props.chapter.id, e.dataTransfer.getData('id'), this.targetDropX, this.targetDropY);
    }

    newEpisode = () => {
        this.props.createEpiside();
    }


    render() {
        let items = [];
        for (let ekey of Object.keys(this.props.chapter.map)) {
            let e = this.props.chapter.map[ekey];
            items.push(<ChapterItem onClick={() => this.props.selectEpisode(e.episode.id)} key={e.episode.id} episode={e.episode} x={e.x + 1} y={e.y + 1} selected={this.props.selectedEpisode === e.episode.id} />);
        }

        let w = this.state.columns * episodeWidth + (this.state.columns - 1) * gridGap;
        let h = this.state.rows * episodeHeight + (this.state.rows - 1) * gridGap;

        return (

            <div style={{ overflowY: 'scroll', overflowX: 'scroll', position: 'relative', padding: gridGap / 2 }} onDragOver={this.onDragOver} onDrop={this.onDrop} onDragLeave={this.onDragLeave} className={(this.props as any).className}>

                <div ref={this.onDragPlaceholderCreated} style={{
                    opacity: 0,
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    border: '1px dotted gray',
                    borderRadius: 5,
                    width: 100,
                    height: 100,
                    zIndex: -1
                }} />

                <svg style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -2,
                    width: w,
                    height: h,
                    padding: 10,
                }}>

                    {this.renderLines()}
                </svg>
                <Grid w={w} h={h}>
                    {items}
                </Grid>

                <Button onClick={this.newEpisode} style={
                    {
                        position: 'fixed',
                        top: 'calc(50% - 50px)',
                        left: 'calc(100% - 100px)',
                    }}><i className="material-icons">add</i></Button>
            </div>

        );
    }
}

const ChapterMap = Glamorous(ChapterComponent)({
    height: 'calc(50% - 50px)'
});

const ChapterListItemStyled = Glamorous.div<{ selected?: boolean, dragOver?: boolean }>(props => ({
    padding: 16,
    display: 'flex',
    flexShrink: 0,
    backgroundColor: props.selected ? '#efefef' : undefined,
    alignItems: 'left',
    ':hover': {
        background: '#f3f3f3'
    },
    borderLeft: props.dragOver ? 'dashed 1px black' : '',
}));

class ChapterListItem extends React.Component<{ item: Chapter, index: number, selected?: boolean, onClick: (id: string) => void, move: (from: number, to: number) => void }, { dragOver: boolean, dragging: boolean, chapterName: string }> {
    static anyDragged = false;
    constructor(props: any) {
        super(props);
        this.state = { dragOver: false, dragging: false, chapterName: props.item.name };
    }

    onDragStart = (e) => {
        ChapterListItem.anyDragged = true;
        e.dataTransfer.setData('from', this.props.index);
        let tagget = e.target;
        setTimeout(function () {
            tagget.style.visibility = 'hidden';
        }, 1);
        this.setState({
            dragging: true
        });
    }

    onDragEnd = (e) => {
        let tagget = e.target;
        setTimeout(function () {
            tagget.style.visibility = '';
        }, 1);
        this.setState({
            dragging: false
        });
    }

    onDragOver = (e) => {
        e.preventDefault();
        if (!this.state.dragging) {
            this.setState({ dragOver: true });
        }
    }

    onDragLeave = (e) => {
        this.setState({ dragOver: false })
    }

    onDrop = (e) => {
        e.preventDefault();
        var index = e.dataTransfer.getData('from');
        this.props.move(index, this.props.index)
        this.setState({ dragOver: false })
    }

    rename = (v: any) => {
        this.props.item.name = v.target.value;
        this.setState({ chapterName: this.props.item.name });
    }

    render() {
        return (
            <Vertical onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
                <ChapterListItemStyled dragOver={this.state.dragOver && ChapterListItem.anyDragged} draggable={true} onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
                    <Input value={this.state.chapterName} onChange={this.rename} />
                </ChapterListItemStyled>
            </Vertical>
        );
    }
}

const TextContentStyled = Glamorous.div({
    whiteSpace: 'pre-wrap',
    border: '1px solid gray',
    padding: 10,
    borderRadius: 10
});
class ContentRender<C extends Content | Reaction> extends React.Component<{ content: C, onClick: (content: C) => void }>{
    render() {
        let content: any = <TextContentStyled><strong>Not supported yet</strong></TextContentStyled>;
        if (this.props.content.type === 'text') {
            content = <TextContentStyled>{(this.props.content as Partial<TextContent>).text}</TextContentStyled>;
        } else if (this.props.content.type === 'closed_text') {
            content = <TextContentStyled>{(this.props.content as Partial<ReactionClosedText>).title}</TextContentStyled>;
        }
        return (
            React.cloneElement(content, { onClick: () => this.props.onClick(this.props.content) })
        );
    }
}

class TextContenSettings extends React.Component<{ content: TextContent, onChange: (content: TextContent) => void }>{
    render() {
        return (
            <TextArea value={this.props.content.text} onChange={(v: any) => this.props.onChange({ ...this.props.content, text: v.target.value })} />
        );
    }
}


class ReactionClosedTextettings extends React.Component<{ content: ReactionClosedText, onChange: (content: ReactionClosedText) => void }>{
    render() {
        return (
            <>
                <Input value={this.props.content.title} onChange={(v: any) => this.props.onChange({ ...this.props.content, title: v.target.value })} />
                <Select onChange={(v: any) => {
                    this.props.onChange({ ...this.props.content, nextEpisode: v.target.value ? v.target.value : undefined })
                }} value={this.props.content.nextEpisode}>
                    <option key="none" value="">no connection</option>
                    <MapsProvider.Consumer>
                        {maps => Object.keys(maps.eMap).map(eKey => <option key={eKey} value={maps.eMap[eKey].episode.id} >{maps.eMap[eKey].episode.name}</option>)}
                    </MapsProvider.Consumer>
                </Select>
            </>
        );
    }
}

class ContenSettings<C extends Content | Reaction> extends React.Component<{ content?: C, onChange: (content: C) => void }>{
    render() {
        if (!this.props.content) {
            return <Vertical flex={1} />;
        }
        let content: any = <TextContentStyled><strong>Not supported yet</strong></TextContentStyled>;
        if (this.props.content.type === 'text') {
            content = <TextContenSettings content={this.props.content as any} onChange={this.props.onChange as any} />;
        } else if (this.props.content.type === 'closed_text') {
            content = <ReactionClosedTextettings content={this.props.content as any} onChange={this.props.onChange as any} />;
        }
        return (
            <Vertical flex={1} scrollable={true} padding="16px">
                {/* todo: dev tool, delete */}
                {this.props.content.id}
                {content}
                <Button style={{ alignSelf: 'flex-end' }} color="red"><i className="material-icons">delete</i></Button>
            </Vertical>
        );
    }
}

class EpisodeEditComponent extends React.Component<{ episode: Episode, onChange: (episode: Episode) => void }, {
    selectedElement?: string,
}>{
    constructor(props: { episode: Episode, onChange: (episode: Episode) => void }) {
        super(props);
        let element: { content?: Content, reaction?: Reaction } = [...props.episode.contentReasolvers, ...props.episode.reactionReasolvers][0];
        this.state = { selectedElement: element ? (element.content || element.reaction).id : undefined };
    }

    componentWillReceiveProps(props: { episode: Episode }) {
        let element: { content?: Content, reaction?: Reaction } = [...props.episode.contentReasolvers, ...props.episode.reactionReasolvers][0];
        if (this.props.episode.id !== props.episode.id) {
            this.setState({ selectedElement: element ? (element.content || element.reaction).id : undefined });
        }
    }
    rename = (v: any) => {
        this.props.onChange({ ...this.props.episode, name: v.target.value });
    }

    selectElement = (target: { id: string }) => {
        this.setState({
            selectedElement: target.id
        })
    }

    onElementChange = (target: Content | Reaction) => {
        let res = { ...this.props.episode };

        res.contentReasolvers = res.contentReasolvers.map(c => c.content.id === target.id ? { ...c, content: target as Content } : c);
        res.reactionReasolvers = res.reactionReasolvers.map(c => c.reaction.id === target.id ? { ...c, reaction: target as Reaction } : c);
        console.warn(target);
        this.props.onChange(res);
    }

    addContent = () => {
        this.props.onChange({ ...this.props.episode, contentReasolvers: [...this.props.episode.contentReasolvers, { content: new TextContent("Some text") }] })
    }

    addReaction = () => {
        this.props.onChange({ ...this.props.episode, reactionReasolvers: [...this.props.episode.reactionReasolvers, { reaction: new ReactionClosedText("Some reaction") }] })
    }

    render() {
        let elementContainer: { content?: Content, reaction?: Reaction } = [...this.props.episode.contentReasolvers, ...this.props.episode.reactionReasolvers].filter((c: any) => (c.content || c.reaction).id === this.state.selectedElement)[0];
        return (
            <Horizontal width="100%">
                <Vertical flex={1} padding="16px" scrollable={true} alignItems="flex-start">
                    <Input value={this.props.episode.name} onChange={this.rename} />
                    {this.props.episode.contentReasolvers.map(c =>
                        <ContentRender key={c.content.id} content={c.content} onClick={this.selectElement} />
                    )}
                    <Button onClick={this.addContent} style={{ alignSelf: 'flex-start' }} color="blue"><i className="material-icons">add</i><i className="material-icons">edit</i></Button>

                    {this.props.episode.reactionReasolvers.map(c =>
                        <ContentRender key={c.reaction.id} content={c.reaction} onClick={this.selectElement} />
                    )}
                    <Button onClick={this.addReaction} style={{ alignSelf: 'flex-start' }} color="blue"><i className="material-icons">add</i><i className="material-icons">message</i></Button>

                </Vertical>
                <ContenSettings content={elementContainer ? elementContainer.content || elementContainer.reaction : undefined} onChange={this.onElementChange} />
            </Horizontal>
        );
    }
}

const ChapterList = Glamorous.div({
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    flexGrow: 1,
    flexShrink: 0,
    overflowX: 'scroll',
    overflowY: 'hidden',
    maxWidth: '100%',
    background: '#f7f7f7',
});

interface BuilderState {
    root: Episode,
    episodesMap: { [key: string]: { episode: Episode } }
    timeLine: Chapter[],
    chapterMap: { [key: string]: { chapter: Chapter } }
    selectedChapter: string,
    selectedepisode: string,
}

const BottomConstainer = Glamorous(Horizontal)({
    height: 'calc(50% - 50px)',
    width: '100%'
});

export class Builder extends React.Component<{}, BuilderState>{
    constructor(props: any) {
        super(props);
        let root = new Episode();

        let rootChapter = new Chapter();
        rootChapter.name = 'Chapter 1';
        rootChapter.map[root.id] = { episode: root, x: 0, y: 0 };

        let eMap = { ...rootChapter.map };

        let cMap = {};
        cMap[rootChapter.id] = { chapter: rootChapter };

        //recover editor state
        let builderState = JSON.parse(window.localStorage.getItem('builderState'));


        this.state = {
            root: root,
            timeLine: [rootChapter],
            episodesMap: eMap,
            chapterMap: cMap,
            selectedChapter: rootChapter.id,
            selectedepisode: root.id,
            ...builderState
        }
    }

    componentDidUpdate() {
        window.localStorage.setItem('builderState', JSON.stringify(this.state));
    }

    newEpisode = (targetChapter?: string) => {
        let e = new Episode();
        let map = { ...this.state.episodesMap };
        map[e.id] = { episode: e };

        let chapter = this.state.chapterMap[targetChapter || this.state.selectedChapter].chapter;

        // find place
        let x = 0;
        let fits = false;
        while (!fits) {
            fits = true;
            for (let eKey of Object.keys(chapter.map)) {
                let e = chapter.map[eKey];
                if (e.x === x) {
                    x++;
                    fits = false;
                    break;
                }
            }
        }

        chapter.map[e.id] = { episode: e, x: x, y: 0 };

        this.setState({
            episodesMap: map,
            selectedepisode: e.id,
        })

    }

    newChapter = () => {
        let chapter = new Chapter();
        let map = { ...this.state.chapterMap };
        map[chapter.id] = { chapter: chapter };
        let timeLine = [...this.state.timeLine, chapter]
        this.setState({
            chapterMap: map,
            selectedChapter: chapter.id,
            timeLine: timeLine,
        },
            () => this.newEpisode()
        );
    }

    onChapterLayoutRequestsChange = (chapterId: string, epsodeId: string, x: number, y: number) => {
        let targetChapter = this.state.timeLine.filter(c => c.id === chapterId)[0];
        if (targetChapter) {
            let targetEpisode = targetChapter.map[epsodeId];
            if (targetEpisode) {
                targetEpisode.x = x;
                targetEpisode.y = y;
                this.setState({
                    timeLine: this.state.timeLine
                })
            }
        }
    }

    moveChapter = (from, to) => {
        let res = [...this.state.timeLine]
        res.splice(to, 0, res.splice(from, 1)[0]);
        this.setState({
            timeLine: res
        });
    }

    updateEpisode = (e: Episode) => {
        // todo: capture incoming connection

        let newMap = { ...this.state.episodesMap };
        let newCMap = { ...this.state.chapterMap };
        newMap[e.id] = { episode: e };
        for (let c of this.state.timeLine) {
            let eMapped = c.map[e.id];
            if (eMapped) {
                c.map[e.id] = { ...eMapped, episode: e };
                newCMap[c.id].chapter.map[e.id] = c.map[e.id];
            }
        }
        this.setState({ episodesMap: newMap, chapterMap: newCMap });
    }

    selectEpisode = (id: string) => {
        this.setState({ selectedepisode: id });
    }

    render() {
        return (
            <MapsProvider.Provider value={{ eMap: this.state.episodesMap, cMap: this.state.chapterMap }}>
                <Vertical height='100vh' divider={0}>
                    <ChapterList>
                        {this.state.timeLine.map((c: Chapter, i: number) => <ChapterListItem key={c.id} item={c} index={i} onClick={() => this.setState({ selectedChapter: c.id })} selected={c.id === this.state.selectedChapter} move={this.moveChapter} />)}
                        <Button onClick={this.newChapter} style={{ margin: 5 }}><i className="material-icons">add</i></Button>
                    </ChapterList>
                    <ChapterMap selectEpisode={this.selectEpisode} chapter={this.state.chapterMap[this.state.selectedChapter].chapter} selectedEpisode={this.state.selectedepisode} onChange={this.onChapterLayoutRequestsChange} createEpiside={this.newEpisode} />
                    <BottomConstainer>
                        <EpisodeEditComponent episode={this.state.episodesMap[this.state.selectedepisode].episode} onChange={this.updateEpisode} />
                    </BottomConstainer>
                </ Vertical>
            </MapsProvider.Provider>

        )
    }
}