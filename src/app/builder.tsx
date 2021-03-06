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

export class Content {
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

export abstract class Condition {
    type: ConditionType;
    constructor(type: ConditionType) {
        this.type = type;
    }
}

export class ConditionEquals extends Condition {
    target: string;
    ethalon: string;
    constructor(target: string, ethalon: string) {
        super('equals')
        this.target = target;
        this.ethalon = ethalon;
    }
}

export class ConditionGreather extends Condition {
    target: string;
    ethalon: string;
    constructor(target: string, ethalon: string) {
        super('greater')
        this.target = target;
        this.ethalon = ethalon;
    }
}

export class ConditionLess extends Condition {
    target: string;
    ethalon: string;
    constructor(target: string, ethalon: string) {
        super('less')
        this.target = target;
        this.ethalon = ethalon;
    }
}

type ActionType = 'set' | 'increment' | 'decriment';

export class Action {
    type: ActionType;
    target: string;
    value: string;
    id: string;
    constructor(type: ActionType, target: string, value: string) {
        this.type = type;
        this.target = target;
        this.value = value;
        this.id = 'action_' + getUid();
    }
}

type ReactionType = 'closed_text' | 'open_text' | 'pipe';
export class Reaction {
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

export class Episode {
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
const colors3 = ['#F55D3E', '#878E88', '#F7CB15', '#76BED0', '#540D6E', '#EE4266', '#F7CB15', '#134074', '#1F271B', '#EF3840', '#F17105', '#E6C229', '#177E89', '#7B1E7A', '#3772FF', '#E2EF70', '#E26D5A', '#AD343E', '#565264']
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


                    let color = colors3[Math.abs(hashCode(reactionResolver.reaction.id + toEpisodeId)) % colors3.length];

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

            <div style={{ overflowY: 'scroll', overflowX: 'scroll', position: 'relative', padding: gridGap / 2, flexBasis: '40%' }} onDragOver={this.onDragOver} onDrop={this.onDrop} onDragLeave={this.onDragLeave} className={(this.props as any).className}>

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
                        left: '40%',
                        bottom: 50,
                    }}><i className="material-icons">add</i></Button>
            </div>

        );
    }
}

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
export class ContentRender<C extends Content | Reaction> extends React.Component<{ content: C, selected?: boolean, onClick?: (content: C) => void }>{
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

class ConditionRender extends React.Component<{ conditon: Condition, onChange: (condition: any) => void }>{

    onTargetChange = (target: any) => {
        this.props.onChange({ ...this.props.conditon, target: target.target.value })
    }

    onEthalonChange = (target: any) => {
        this.props.onChange({ ...this.props.conditon, ethalon: target.target.value })
    }

    onCompareTypeChange = (target: any) => {
        this.props.onChange({ ...this.props.conditon, type: target.target.value })
    }

    render() {
        let content: any = 'Not yet supported';
        let type = this.props.conditon.type;
        if (type === 'equals' || type === 'greater' || type === 'less') {
            content = (
                <Horizontal alignItems="center">
                    <Vertical>
                        will show if
                        <Input style={{ marginLeft: 8, width: 50 }} value={(this.props.conditon as any).target} onChange={this.onTargetChange} />
                    </Vertical>
                    <Select value={type} onChange={this.onCompareTypeChange}>
                        <option value="equals">{'='}</option>
                        <option value="greater">{'>'}</option>
                        <option value="less">{'<'}</option>
                    </Select>
                    <Input style={{ width: 50 }} value={(this.props.conditon as any).ethalon} onChange={this.onEthalonChange} />
                </Horizontal>
            );
        }
        return content;
    }
}

class ActionRender extends React.Component<{ action: Action, onChange: (action: Action) => void }>{

    onTargetChange = (target: any) => {
        this.props.onChange({ ...this.props.action, target: target.target.value })
    }

    onValueChange = (target: any) => {
        this.props.onChange({ ...this.props.action, value: target.target.value })
    }

    onCompareTypeChange = (target: any) => {
        this.props.onChange({ ...this.props.action, type: target.target.value })
    }

    render() {
        let content: any = 'Not yet supported';
        let type = this.props.action.type;
        if (type === 'set' || type === 'increment' || type === 'decriment') {
            content = (
                <Horizontal alignItems="center">
                    <Vertical>
                        set
                        <Input style={{ marginLeft: 8, width: 50 }} value={this.props.action.target} onChange={this.onTargetChange} />
                    </Vertical>
                    <Select value={type} onChange={this.onCompareTypeChange}>
                        <option value="set">{'='}</option>
                        <option value="increment">{'+'}</option>
                        <option value="decriment">{'-'}</option>
                    </Select>
                    <Input style={{ width: 50 }} value={this.props.action.value} onChange={this.onValueChange} />
                </Horizontal>
            );
        }
        return content;
    }
}

class ContenSettings<C extends Content | Reaction> extends React.Component<{ content?: C, condition?: Condition, actions?: Action[] | null, onChange: (content: C) => void, onCondtionChange: (content: Condition) => void, onActionsChange: (target: string, actions: Action[]) => void }>{
    onConditionChange = (condition: Condition) => {
        this.props.onCondtionChange(condition);
    }

    onConditionDelete = () => {
        this.props.onCondtionChange(undefined);
    }

    onActionChange = (action: Action) => {
        let res = (this.props.actions || []).map(a => a.id === action.id ? action : a);
        this.props.onActionsChange(this.props.content.id, [...res]);
    }

    onActionCreate = () => {
        this.props.onActionsChange(this.props.content.id, [...this.props.actions || [], new Action('set', '', '')]);
    }

    onActionDelete = (id: string) => {
        let res = (this.props.actions || []).filter(a => a.id !== id);
        this.props.onActionsChange(this.props.content.id, [...res]);
    }

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
                {this.props.condition && (
                    <Horizontal>
                        <div style={{ flexGrow: 1 }}>
                            <ConditionRender conditon={this.props.condition} onChange={this.onConditionChange} />
                        </div>
                        <Button color="red" onClick={this.onConditionDelete}><i className="material-icons">delete</i></Button>

                    </Horizontal>
                )}
                {!this.props.condition && <Button onClick={() => this.onConditionChange(new ConditionEquals('', ''))}>always shown</Button>}

                {content}

                {(this.props.actions || []).map(
                    a =>
                        <Horizontal>
                            <div style={{ flexGrow: 1 }}>
                                <ActionRender onChange={this.onActionChange} action={a} />
                            </div >
                            <Button color="red" onClick={() => this.onActionDelete(a.id)}><i className="material-icons">delete</i></Button>
                        </Horizontal>
                )}
                {this.props.actions !== null && <Button onClick={this.onActionCreate}>add action</Button>}
                <Button style={{ alignSelf: 'flex-end' }} color="red"><i className="material-icons">delete</i></Button>
            </Vertical>
        );
    }
}

class EpisodeEditComponent extends React.Component<{ episode: Episode, onChange: (episode: Episode) => void, selectedElement?: string }, {
    selectedElement?: string | 'scene',
}>{
    extractState(props) {
        let elements: { content?: Content, reaction?: Reaction }[] = [...props.episode.contentReasolvers, ...props.episode.reactionReasolvers];
        let element = elements[0];
        return { selectedElement: elements.filter(e => ((e.content || e.reaction) as any).id === props.selectedElement).length > 0 || props.selectedElement === 'scene' ? props.selectedElement : (element ? (element.content || element.reaction).id : 'scene') };
    }

    constructor(props: { episode: Episode, onChange: (episode: Episode) => void, selectedElement?: string }) {
        super(props);
        this.state = this.extractState(props);
    }

    componentWillReceiveProps(props: { episode: Episode, selectedElement?: string }) {
        this.setState(this.extractState(props));
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

    onConditionChange = (target: string, condition: Condition) => {
        let res = { ...this.props.episode };

        res.contentReasolvers = res.contentReasolvers.map(c => c.content.id === target ? { ...c, condition: condition } : c);
        res.reactionReasolvers = res.reactionReasolvers.map(c => c.reaction.id === target ? { ...c, condition: condition } : c);
        console.warn(target);
        this.props.onChange(res);
    }

    onActionsChange = (target: string, actions: Action[]) => {
        let res = { ...this.props.episode };

        res.reactionReasolvers = res.reactionReasolvers.map(c => c.reaction.id === target ? { ...c, actions: actions } : c);
        console.warn(target, res, actions);
        this.props.onChange(res);
    }

    addContent = () => {
        this.props.onChange({ ...this.props.episode, contentReasolvers: [...this.props.episode.contentReasolvers, { content: new TextContent("Some text") }] })
    }

    addReaction = () => {
        this.props.onChange({ ...this.props.episode, reactionReasolvers: [...this.props.episode.reactionReasolvers, { reaction: new ReactionClosedText("Some reaction") }] })
    }

    render() {
        let elementContainer: { content?: Content, reaction?: Reaction, condition?: Condition, actions?: Action[] } = [...this.props.episode.contentReasolvers, ...this.props.episode.reactionReasolvers].filter((c: any) => (c.content || c.reaction).id === this.state.selectedElement)[0];
        return (
            <Horizontal width="100%">
                <Vertical scrollable={true} style={{ flex: 1 }}>
                    {this.state.selectedElement !== 'scene' && (
                        <ContenSettings onActionsChange={this.onActionsChange} condition={elementContainer.condition} actions={elementContainer.reaction ? elementContainer.actions : null} content={elementContainer ? elementContainer.content || elementContainer.reaction : undefined} onChange={this.onElementChange} onCondtionChange={c => this.onConditionChange(((elementContainer.content || elementContainer.reaction) as any).id, c)} />
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

class EpisodePreview extends React.Component<{ episode: Episode, onChange?: (episode: Episode) => void, onClick?: (content: Content) => void }>{
    addContent = () => {
        this.props.onChange({ ...this.props.episode, contentReasolvers: [...this.props.episode.contentReasolvers, { content: new TextContent("Some text") }] })
    }

    addReaction = () => {
        this.props.onChange({ ...this.props.episode, reactionReasolvers: [...this.props.episode.reactionReasolvers, { reaction: new ReactionClosedText("Some reaction") }] })
    }
    render() {
        return (
            <div style={{ position: 'relative', overflow: 'hidden', flex: 1 }} >
                <SceneBackground id={this.props.episode.sceneId} raw={true} fill={true} blur={true} animated={true} onClick={() => this.props.onClick(null)} />
                <Vertical style={{ position: 'absolute', left: 0, top: 0, padding: 0, height: '100%', overflowX: 'hidden', width: '100%' }} scrollable={true}>
                    <Input style={{ margin: 16 }} value={this.props.episode.name} onChange={this.props.onChange ? (v: any) => this.props.onChange({ ... this.props.episode, name: v.target.value }) : undefined} />
                    <Vertical style={{ flexGrow: 1, padding: 16, paddingBottom: 0, alignItems: 'flex-start' }}>
                        {this.props.episode.contentReasolvers.map(c => <ContentRender content={c.content} onClick={this.props.onClick} />)}
                        <TextContentStyled onClick={this.addContent} style={{ fontSize: 12 }} >✏️</TextContentStyled>
                    </Vertical>
                    <div style={{ flexWrap: 'wrap', display: 'flex', marginLeft: -8, marginRight: -8, padding: 16, paddingBottom: 8, paddingTop: 0, flexShrink: 0 }} >
                        {this.props.episode.reactionReasolvers.map(c => <ContentRenderMargin content={c.reaction} onClick={this.props.onClick} />)}
                        <ActionTextContentStyled style={{ margin: 8, fontSize: 12 }} onClick={this.addReaction}  >💬</ActionTextContentStyled>
                    </div>

                </Vertical>
            </div >
        )
    }
}

export interface BuilderState {
    root: Episode,
    episodesMap: { [key: string]: Episode }
    timeLine: string[],
    chapterMap: { [key: string]: Chapter }
    selectedChapter: string,
    selectedepisode: string,
    selectedElement?: string,
}

export class Builder extends React.PureComponent<{ onChanged: (builderState: BuilderState) => void, initialState: BuilderState }, BuilderState>{
    constructor(props: any) {
        super(props);
        this.state = props.initialState;
    }

    componentDidUpdate() {
        window.localStorage.setItem('chaptersState', JSON.stringify({ timeLine: this.state.timeLine, chapterMap: this.state.chapterMap, selectedChapter: this.state.selectedChapter, selectedepisode: this.state.selectedepisode }));
        this.props.onChanged(this.state)
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

    selectElement = (content: Content) => {
        this.setState({ selectedElement: content ? content.id : 'scene' });
    }

    render() {
        return (
            <MapsProvider.Provider value={{ eMap: this.state.episodesMap, cMap: this.state.chapterMap }}>
                <ChapterComponent eMap={this.state.episodesMap} selectEpisode={this.selectEpisode} chapter={this.state.chapterMap[this.state.selectedChapter]} selectedEpisode={this.state.selectedepisode} onChange={this.onChapterLayoutRequestsChange} createEpiside={this.newEpisode} />

                <Horizontal flex={2}>
                    <EpisodePreview onChange={this.updateEpisode} episode={this.state.episodesMap[this.state.selectedepisode]} onClick={this.selectElement} />
                </Horizontal>
                <Horizontal flex={1}>
                    <EpisodeEditComponent episode={this.state.episodesMap[this.state.selectedepisode]} selectedElement={this.state.selectedElement} onChange={this.updateEpisode} />
                </Horizontal>
            </MapsProvider.Provider>

        )
    }
}