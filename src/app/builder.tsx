import * as React from 'react';
import Glamorous from 'glamorous';
import { Vertical, Input, Horizontal, Button, TextArea, Select } from './editor';
import { getUid } from './utils/id';
import { Scene, ScenePicker } from './scenePicker';
import { relative } from 'path';

interface StoryState {
    story: Content[];
    vars: { [key: string]: string | number };
    currentReaction?: Content;
    nextEpisodeId: string;
}

type ContentType = 'text' | 'image';

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
        super('text', 'content_text_' + getUid(), name);
        this.text = text;
    }
}

class ImageContent extends Content {
    src: string;
    constructor(src?: string, name?: string) {
        super('image', 'content_image_' + getUid(), name);
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

type ActionType = 'set' | 'increment' | 'decriment';

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
        super('set', condition)
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
        this.id = 'reaction_' + getUid();
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
        this.id = 'episode_' + getUid();
        this.name = 'Episode'
        this.reactionReasolvers = [{ reaction: new ReactionClosedText('Some reaction') }];
        this.contentReasolvers = [{ content: new TextContent('Some text') }];
    }
}

class Chapter {
    id: string;
    name: string;
    map: { [episodeId: string]: { x: number, y: number, episodeId: string } } = {};

    constructor() {
        this.id = 'chapter_' + getUid();
        this.name = 'Chapter';
    }
}

const episodeBorder = 1;
const EpisodeDiv = Glamorous(Vertical)<{ selected: boolean }>((props) => ({
    border: `${props.selected ? 2 : episodeBorder}px solid ${props.selected ? 'black' : 'gray'}`,
    borderRadius: 5,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
}));

const SceneBackground = Glamorous(Scene)({
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
});

const MapsProvider = React.createContext<{ eMap: { [id: string]: Episode }, cMap: { [id: string]: Chapter } }>({ eMap: {}, cMap: {} });

class EpisodeComponent extends React.Component<{ episodeId: string, selected: boolean, onClick: () => void }>{
    element?: HTMLElement;
    onEpisodeCreated = (e: HTMLElement) => {
        this.element = e;
    }

    onDragStart = (e) => {
        e.dataTransfer.setData('id', this.props.episodeId);
    }

    render() {
        return (
            <MapsProvider.Consumer>
                {data =>

                    <EpisodeDiv onClick={this.props.onClick} draggable={true} selected={this.props.selected} onDragStart={this.onDragStart} innerRef={this.onEpisodeCreated} className={(this.props as any).className}>
                        <SceneBackground id={data.eMap[this.props.episodeId].sceneId} raw={true} fill={true} blur={false} />

                        {data.eMap[this.props.episodeId].name}
                    </EpisodeDiv>
                }
            </MapsProvider.Consumer>

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
    eMap: { [key: string]: Episode };
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
            this.episodesCordinates[e.x + '_' + e.y] = e.episodeId;
        }
    }

    renderLines = () => {
        let lines = [];

        for (let eKey of Object.keys(this.props.chapter.map)) {
            let from = this.props.chapter.map[eKey];
            let fromEpisode = this.props.eMap[from.episodeId];
            for (let reactionResolver of fromEpisode.reactionReasolvers) {
                if (reactionResolver.reaction.nextEpisode) {

                    let rectFrom = {
                        left: ((from.x) * (episodeWidth + gridGap)) + 2 + gridGap / 2,
                        right: ((from.x) * (episodeWidth + gridGap)) + 2 + episodeWidth + gridGap / 2,
                        top: ((from.y) * (episodeHeight + gridGap)) + 2 + gridGap / 2,
                        bottom: ((from.y) * (episodeHeight + gridGap)) + 2 + episodeHeight + gridGap / 2,
                    };

                    let to = this.props.chapter.map[reactionResolver.reaction.nextEpisode];
                    to = to || { x: from.x, y: from.y, episodeId: reactionResolver.reaction.nextEpisode };
                    let toEpisodeId = reactionResolver.reaction.nextEpisode;

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


                    let color = colors2[Math.abs(hashCode(reactionResolver.reaction.id + toEpisodeId)) % colors.length];

                    lines.push(<marker key={'arrow_' + fromEpisode.id + '_' + toEpisodeId} id={'arrow_' + fromEpisode.id + '_' + toEpisodeId} markerWidth="3" markerHeight="2" refX="0" refY="0.5" orient={yt === rectTo.top ? '90' : yt === rectTo.bottom ? '270' : 'auto'} markerUnits="strokeWidth">
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

                    // console.warn(hashCode(fromEpisode.id + toEpisodeId) % colors.length);
                    // lines.push(<polyline key={'connect_1' + fromEpisode.id + '_' + toEpisodeId} points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2}  ${xt} ${yt}`} fill="none" style={{ stroke: (colors[Math.abs(hashCode(reactionResolver.reaction.id + toEpisodeId)) % colors.length]), strokeWidth: 10, strokeDasharray: '5,5', opacity: 1 }} />);
                    lines.push(<polyline key={'connect_2' + fromEpisode.id + '_' + toEpisodeId} points={`${xf} ${yf} ${xm1} ${ym1} ${xm2} ${ym2}  ${xt} ${yt}`} fill="none" style={{ stroke: color, strokeWidth: 10, opacity: 0.5 }} markerEnd={`url(#${'arrow_' + fromEpisode.id + '_' + toEpisodeId})`} />);
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
            // ugly fix - find top/left offset
            let x = e.clientX + offsetx - 74;
            let y = e.pageY + offsety - 58;

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
            items.push(<ChapterItem onClick={() => this.props.selectEpisode(e.episodeId)} key={e.episodeId} episodeId={e.episodeId} x={e.x + 1} y={e.y + 1} selected={this.props.selectedEpisode === e.episodeId} />);
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
                    // padding: 10,
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
                        left: 'calc(70% - 100px)',
                    }}><i className="material-icons">add</i></Button>
            </div>

        );
    }
}

const ChapterMap = Glamorous(ChapterComponent)({
    height: 'calc(50% - 50px)',
    flexBasis: '70%',
    overflow: 'scroll'
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
        this.state = { dragOver: false, dragging: false, chapterName: props.item && props.item.name };
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

const TextContentStyled = Glamorous.div<{ selected?: boolean }>(props => ({
    whiteSpace: 'pre-wrap',
    border: props.selected ? '1px solid #3E5C6B' : undefined,
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '16px',
    backgroundColor: 'rgba(250, 250, 250, 0.4)',
    padding: 10,
    borderRadius: 10,
    cursor: 'pointer'
}));

const ActionTextContentStyled = Glamorous.div<{ selected?: boolean }>(props => ({
    whiteSpace: 'pre-wrap',
    border: props.selected ? '1px solid #3E5C6B' : '1px solid rgba(250, 250, 250, 0.6)',
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: '16px',
    backgroundColor: 'rgba(250, 250, 250, 0.4)',
    padding: 10,
    borderRadius: 10,
    cursor: 'pointer'

}));
class ContentRender<C extends Content | Reaction> extends React.Component<{ content: C, selected?: boolean, onClick?: (content: C) => void }>{
    render() {
        let content: any = <TextContentStyled><strong>Not supported yet</strong></TextContentStyled>;
        if (this.props.content.type === 'text') {
            content = <TextContentStyled>{(this.props.content as Partial<TextContent>).text}</TextContentStyled>;
        } else if (this.props.content.type === 'closed_text') {
            content = <ActionTextContentStyled>{(this.props.content as Partial<ReactionClosedText>).title}</ActionTextContentStyled>;
        }
        return (
            React.cloneElement(content, { onClick: () => this.props.onClick(this.props.content), className: (this.props as any).className, selected: this.props.selected })
        );
    }
}

class TextContenSettings extends React.Component<{ content: TextContent, onChange: (content: TextContent) => void }>{
    render() {
        return (
            <TextArea style={{ height: '100%' }} value={this.props.content.text} onChange={(v: any) => this.props.onChange({ ...this.props.content, text: v.target.value })} />
        );
    }
}


class ReactionClosedTextettings extends React.Component<{ content: ReactionClosedText, onChange: (content: ReactionClosedText) => void }>{
    render() {
        return (
            <>
                <Input value={this.props.content.title} onChange={(v: any) => this.props.onChange({ ...this.props.content, title: v.target.value })} />
                <Horizontal alignItems="center" >
                    Next episode:
                    <Select style={{ marginLeft: 8 }} key={this.props.content.id} onChange={(v: any) => {
                        this.props.onChange({ ...this.props.content, nextEpisode: v.target.value ? v.target.value : undefined })
                    }} value={this.props.content.nextEpisode}>
                        <option key="none" value="">no connection</option>
                        <MapsProvider.Consumer>
                            {maps => Object.keys(maps.eMap).map(eKey => <option key={eKey} value={maps.eMap[eKey].id} >{maps.eMap[eKey].name}</option>)}
                        </MapsProvider.Consumer>
                    </Select>
                </Horizontal>

            </>
        );
    }
}

// class ConditionRender extends React.Component<{ conditon: Condition }>{
//     render() {
//         let content = 'Not yet supported';
//         let type = this.props.conditon.type;
//         if (type === 'equals') {
//             <>
//         }
//         return content;
//     }
// }

class ContenSettings<C extends Content | Reaction> extends React.Component<{ content?: C, condition?: Condition, onChange: (content: C) => void }>{
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
                {content}
                <Button style={{ alignSelf: 'flex-end' }} color="red"><i className="material-icons">delete</i></Button>
            </Vertical>
        );
    }
}

class EpisodeEditComponent extends React.Component<{ episode: Episode, onChange: (episode: Episode) => void }, {
    selectedElement?: string | 'scene',
}>{
    constructor(props: { episode: Episode, onChange: (episode: Episode) => void }) {
        super(props);
        let element: { content?: Content, reaction?: Reaction } = [...props.episode.contentReasolvers, ...props.episode.reactionReasolvers][0];
        this.state = { selectedElement: element ? (element.content || element.reaction).id : 'scene' };
    }

    componentWillReceiveProps(props: { episode: Episode }) {
        let element: { content?: Content, reaction?: Reaction } = [...props.episode.contentReasolvers, ...props.episode.reactionReasolvers][0];
        if (this.props.episode.id !== props.episode.id) {
            this.setState({ selectedElement: element ? (element.content || element.reaction).id : 'scene' });
        }
    }
    rename = (v: any) => {
        this.props.onChange({ ...this.props.episode, name: v.target.value });
    }

    setScene = (id: string) => {
        this.props.onChange({ ...this.props.episode, sceneId: id });
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
        console.warn(this.props.episode.sceneId);
        let elementContainer: { content?: Content, reaction?: Reaction, condition?: Condition } = [...this.props.episode.contentReasolvers, ...this.props.episode.reactionReasolvers].filter((c: any) => (c.content || c.reaction).id === this.state.selectedElement)[0];
        return (
            <Horizontal width="100%">
                <Vertical style={{ borderRight: '1px solid #3E5C6B' }} flex={1} padding="16px" scrollable={true} alignItems="flex-start">


                    <Input value={this.props.episode.name} onChange={this.rename} />
                    <Scene id={this.props.episode.sceneId} onClick={() => this.setState({ selectedElement: 'scene' })} />
                    {this.props.episode.contentReasolvers.map(c =>
                        <ContentRender selected={this.state.selectedElement === c.content.id} key={c.content.id} content={c.content} onClick={this.selectElement} />
                    )}
                    <Button onClick={this.addContent} style={{ alignSelf: 'flex-start' }} color="#3E5C6B"><i className="material-icons">add</i><i className="material-icons">edit</i></Button>

                    {this.props.episode.reactionReasolvers.map(c =>
                        <ContentRender selected={this.state.selectedElement === c.reaction.id} key={c.reaction.id} content={c.reaction} onClick={this.selectElement} />
                    )}
                    <Button onClick={this.addReaction} style={{ alignSelf: 'flex-start' }} color="#3E5C6B"><i className="material-icons">add</i><i className="material-icons">message</i></Button>

                </Vertical>
                <Vertical scrollable={true} style={{ flex: 1 }}>
                    {this.state.selectedElement !== 'scene' && (
                        <ContenSettings condition={elementContainer.condition} content={elementContainer ? elementContainer.content || elementContainer.reaction : undefined} onChange={this.onElementChange} />
                    )}
                    {this.state.selectedElement === 'scene' && (
                        <ScenePicker onclick={this.setScene} />
                    )}
                </Vertical>
            </Horizontal>
        );
    }
}

const ContentRenderMargin = Glamorous(ContentRender)({
    margin: 8,
});

class EpisodePreview extends React.Component<{ episode: Episode }>{
    render() {
        return (
            <div style={{ position: 'relative', flexBasis: '30%', height: 'calc(50%)', overflow: 'hidden' }} >
                <SceneBackground id={this.props.episode.sceneId} raw={true} fill={true} blur={true} animated={true} />
                <Vertical style={{ position: 'absolute', left: 0, top: 0, padding: 0, height: '100%', overflowX: 'hidden' }} scrollable={true}>
                    <Vertical style={{ flexGrow: 1, padding: 16, paddingBottom: 0, alignItems: 'flex-start' }}>
                        {this.props.episode.contentReasolvers.map(c => <ContentRender content={c.content} />)}
                    </Vertical>
                    <div style={{ flexWrap: 'wrap', display: 'flex', marginLeft: -8, marginRight: -8, padding: 16, paddingBottom: 8, paddingTop: 0 }} >
                        {this.props.episode.reactionReasolvers.map(c => <ContentRenderMargin content={c.reaction} />)}
                    </div>

                </Vertical>
            </div>
        )
    }
}

const ChapterList = Glamorous.div({
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    flexShrink: 0,
    overflowX: 'scroll',
    overflowY: 'hidden',
    maxWidth: '100%',
    background: '#f7f7f7',
});

interface BuilderState {
    root: Episode,
    episodesMap: { [key: string]: Episode }
    timeLine: string[],
    chapterMap: { [key: string]: Chapter }
    selectedChapter: string,
    selectedepisode: string,
}

const BottomConstainer = Glamorous(Horizontal)({
    height: 'calc(50% - 50px)',
    width: '100%',
    borderTop: '1px solid #3E5C6B'
});

export class Builder extends React.Component<{}, BuilderState>{
    constructor(props: any) {
        super(props);
        let root = new Episode();

        let rootChapter = new Chapter();
        rootChapter.name = 'Chapter 1';
        rootChapter.map[root.id] = { episodeId: root.id, x: 0, y: 0 };

        let eMap = {};
        eMap[root.id] = root;

        let cMap = {};
        cMap[rootChapter.id] = rootChapter;

        let defaultState: BuilderState = {
            root: root,
            timeLine: [rootChapter.id],
            episodesMap: eMap,
            chapterMap: cMap,
            selectedChapter: rootChapter.id,
            selectedepisode: root.id,
        }

        //recover editor state
        let builderState = JSON.parse(window.localStorage.getItem('builderState')) || defaultState;

        this.state = {
            // ...defaultState
            ...builderState
        }
    }

    componentDidUpdate() {
        window.localStorage.setItem('builderState', JSON.stringify(this.state));
    }

    newEpisode = (targetChapter?: string) => {
        let e = new Episode();
        let map = { ...this.state.episodesMap };
        map[e.id] = e;

        let chapter = this.state.chapterMap[targetChapter || this.state.selectedChapter];

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

        chapter.map[e.id] = { episodeId: e.id, x: x, y: 0 };

        let newCMap = { ...this.state.chapterMap };
        newCMap[chapter.id].map[e.id] = chapter.map[e.id];

        this.setState({
            episodesMap: map,
            selectedepisode: e.id,
            chapterMap: newCMap,
        })

    }

    newChapter = () => {
        let chapter = new Chapter();
        let map = { ...this.state.chapterMap };
        map[chapter.id] = chapter;
        let timeLine = [...this.state.timeLine, chapter.id]
        this.setState({
            chapterMap: map,
            selectedChapter: chapter.id,
            timeLine: timeLine,
        },
            () => this.newEpisode()
        );
    }

    onChapterLayoutRequestsChange = (chapterId: string, epsodeId: string, x: number, y: number) => {
        let targetChapter = this.state.chapterMap[chapterId];
        if (targetChapter) {
            let targetEpisode = targetChapter.map[epsodeId];
            if (targetEpisode) {
                targetEpisode.x = x;
                targetEpisode.y = y;

                let newCMap = { ...this.state.chapterMap };
                newCMap[targetChapter.id].map[targetEpisode.episodeId] = targetChapter.map[targetEpisode.episodeId];
                this.setState({
                    chapterMap: newCMap
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
        newMap[e.id] = e;
        this.setState({ episodesMap: newMap });
    }

    selectEpisode = (id: string) => {
        this.setState({ selectedepisode: id });
    }

    render() {
        return (
            <MapsProvider.Provider value={{ eMap: this.state.episodesMap, cMap: this.state.chapterMap }}>
                <Vertical divider={0} className={(this.props as any).className}>
                    <ChapterList>
                        {this.state.timeLine.map((cId: string, i: number) => <ChapterListItem key={cId} item={this.state.chapterMap[cId]} index={i} onClick={() => this.setState({ selectedChapter: cId })} selected={cId === this.state.selectedChapter} move={this.moveChapter} />)}
                        <Button onClick={this.newChapter} style={{ margin: 5 }}><i className="material-icons">add</i></Button>
                    </ChapterList>
                    <Horizontal>
                        <ChapterMap eMap={this.state.episodesMap} selectEpisode={this.selectEpisode} chapter={this.state.chapterMap[this.state.selectedChapter]} selectedEpisode={this.state.selectedepisode} onChange={this.onChapterLayoutRequestsChange} createEpiside={this.newEpisode} />
                        <EpisodePreview episode={this.state.episodesMap[this.state.selectedepisode]} />
                    </Horizontal>
                    <BottomConstainer>
                        <EpisodeEditComponent episode={this.state.episodesMap[this.state.selectedepisode]} onChange={this.updateEpisode} />
                    </BottomConstainer>
                </ Vertical>
            </MapsProvider.Provider>

        )
    }
}