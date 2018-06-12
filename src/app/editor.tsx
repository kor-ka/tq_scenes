import * as React from 'react';
import * as glamor from 'glamor';
import Glamorous from 'glamorous';
import { isUndefined } from 'util';

const StyledScene = Glamorous.div<{ blur: boolean, animation: any }>((props) => ({
  display: 'flex',
  flexGrow: 1,
  transform: props.blur ? 'scale(1.2) translate3d(0, 0, 0) translateZ(0)' : 'translate3d(0, 0, 0) translateZ(0)',
  filter: props.blur ? 'blur(25px)' : undefined,
  border: 1,
  ...props.animation
}));

const Horizontal = Glamorous.div<{ width?: any, zIndex?: number }>(props => ({
  width: props.width,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  padding: 10,
  zIndex: props.zIndex
}));

const Vertical = Glamorous.div<{ width?: any, zIndex?: number }>(props => ({
  width: props.width,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: 10,
  zIndex: props.zIndex
}));

const Root = Glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const SideBar = Glamorous.div({
  width: '10%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  zIndex: 1

});

const SidebarList = Glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  flexGrow: 1,
  background: '#efefef'
});

const SidebarListItemStyled = Glamorous.div<{ selected?: boolean }>(props => ({
  padding: 20,
  display: 'flex',
  backgroundColor: props.selected ? '#e5e5e5' : undefined,
  justifyContent: 'center',
  ':hover': {
    background: '#dedede'
  }
}));

class Polygon {
  id: string;
  name: string;
  points: number[];
  fill: string;
  opacity?: number;
  animation: string;
}

class AnimatonStep {
  timing: number;
  opacity?: number;
  translate?: { x: string, y: string }
}
class Animation {
  id: string;
  name: string;
  steps: AnimatonStep[];
  time: number;
}

const polygonItem = {
  id: 'polygon_1',
  name: 'polygon42',
  points: [0, 0, 500, 0, 450, 350],
  fill: '0365B7',
  animation: 'animation_2'
};


const polygonItem2 = {
  id: 'polygon_2',
  name: 'just polygon',
  points: [500, 200, 100, 200, 300, 410],
  fill: '03FF00',
  animation: 'animation_1'
};

const glow = {
  id: 'animation_1',
  name: 'glow',
  steps: [{
    timing: 0,
    opacity: 0,
  },
  {
    timing: 50,
    opacity: 1,
  },
  {
    timing: 100,
    opacity: 0,
  }],
  time: 5
};

const move = {
  id: 'animation_2',
  name: 'move',
  steps: [{
    timing: 0,
    translate: { x: '0%', y: '0%' }
  },
  {
    timing: 50,
    translate: { x: '10%', y: '-10%' }
  },
  {
    timing: 100,
    translate: { x: '0%', y: '0%' }
  }],
  time: 5
};



class PolygonsListItem extends React.Component<{ item: Polygon, selected?: boolean, onClick: (id: string) => void }> {
  render() {
    return (
      <SidebarListItemStyled onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
        {this.props.item.name}
      </SidebarListItemStyled>
    );
  }
}

class AnimationListItem extends React.Component<{ item: Animation, selected?: boolean, onClick: (id: string) => void }> {
  render() {
    return (
      <SidebarListItemStyled onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
        {this.props.item.name}
      </SidebarListItemStyled>
    );
  }
}


class PolygonFullItem extends React.Component<{ item: Polygon, submit: (item: Polygon) => void }> {
  render() {
    return (
      <Vertical width="20%">
        <div>name: {this.props.item.name}</div>
        <div>fill: {this.props.item.fill}</div>
        <div>opacity: {this.props.item.opacity}</div>
        <div>path: {this.props.item.points.join(" ")}</div>
      </Vertical>
    );
  }
}

class AnimationFullItem extends React.Component<{ item: Animation, selected?: boolean, submit: (item: Animation) => void }> {
  render() {
    return (
      <Vertical width="20%">
        <div>name: {this.props.item.name}</div>
        <div>time: {this.props.item.time}</div>
        <div>steps: </div>
        {this.props.item.steps.map((s, k) => (
          <Vertical key={k} >
            <div>    timing: {s.timing}</div>
            {s.opacity !== undefined && <div>    opacity: {s.opacity}</div>}
            {s.translate && <div>    translate: {'x: ' + s.translate.x + ' y: ' + s.translate.y}</div>}
          </Vertical>
        ))}
      </Vertical>
    );
  }
}



class EditorState {
  tab: 'polygons' | 'animations';
  blur?: boolean
  fill?: boolean
  border: boolean
  middle?: boolean
  selectedP?: string;
  selectedA?: string;
  polygons: Polygon[];
  animations: Animation[];
}

export class SceneEditor extends React.Component<{}, EditorState> {
  constructor(props: EditorState) {
    super(props);
    let polygons = [polygonItem, polygonItem2];
    let animations = [glow, move];
    this.state = { tab: 'polygons', polygons: polygons, border: true, animations: animations, selectedP: polygons.length > 0 ? polygons[0].id : undefined, selectedA: animations.length > 0 ? animations[0].id : undefined };
  }

  switchFlag(key: string) {
    let state: any = {};
    state[key] = !this.state[key];
    this.setState(state);
  }

  animation = () => {
    let animationsKeyframes: any = {};
    let animations: any = {};
    for (let a of this.state.animations) {
      let keyframes: any = {}
      for (let s of a.steps) {
        keyframes[s.timing + "%"] = {
          opacity: s.opacity,
          transform: s.translate ? 'translate3d(' + s.translate.x + ', ' + s.translate.y + ', 0)' : undefined,
        }
      }
      animationsKeyframes[a.id] = glamor.keyframes({
        ...keyframes
      });
      animations[a.id] = a
    }

    let animation: any = {};

    for (let p of this.state.polygons) {
      if(p.animation){
        animation['& #' + p.id] = {
          animation: `${animationsKeyframes[p.animation]} ${animations[p.animation].time}s infinite`
        }
      }
    }
    console.warn(animation);

    return animation;

  }

  polygonsToSvg = () => {
    console.warn(this.state);


    return (
      <svg height="100%" width="100%" viewBox="0 0 600 600" {...(this.state.fill ? { preserveAspectRatio: "xMidYMid slice" } : {})}>
        {this.state.border && <rect key='border' id='border' x="0" y="0" width="600" height="600" fill="none" style={{ stroke: 'gray', strokeWidth: 1, opacity: 0.5 }} />}
        {this.state.polygons.map(polygon =>
          <polygon key={polygon.id} id={polygon.id} fill={"#" + polygon.fill} opacity={polygon.opacity} points={polygon.points.join(" ")} />
        )}
        {this.state.middle && <rect key='middlev' id='middlev' x="200" y="0" width="200" height="600" fill="none" style={{ stroke: 'gray', strokeWidth: 1, opacity: 0.5 }} />}
        {this.state.middle && <rect key='middleh' id='middleh' x="0" y="200" width="600" height="200" fill="none" style={{ stroke: 'gray', strokeWidth: 1, opacity: 0.5 }} />}
      </svg>)
  }


  render() {
    let selectedP = this.state.polygons.filter(p => p.id === this.state.selectedP)[0];
    let selectedA = this.state.animations.filter(p => p.id === this.state.selectedA)[0];

    return (
      <Root>
        <Vertical>
          <button onClick={() => this.setState({ tab: "polygons" })} disabled={this.state.tab === 'polygons'}>P</button>
          <button onClick={() => this.setState({ tab: "animations" })} disabled={this.state.tab === 'animations'}>A</button>
        </Vertical>
        <SideBar>

          <SidebarList>
            {this.state.tab === 'polygons' && this.state.polygons.map(p => <PolygonsListItem key={p.name} item={{ ...p }} onClick={id => {
              this.setState({
                selectedP: id
              })
            }} selected={this.state.selectedP === p.id} />)}

            {this.state.tab === 'animations' && this.state.animations.map(p => <AnimationListItem key={p.name} item={{ ...p }} onClick={id => {
              this.setState({
                selectedA: id
              })
            }} selected={this.state.selectedA === p.id} />)}
          </SidebarList>
          <Horizontal onClick={() => this.switchFlag('blur')}><input key="blur" type="checkbox" checked={this.state.blur} onChange={() => { }} /> blur </Horizontal>
          <Horizontal onClick={() => this.switchFlag('fill')}><input key="fill" type="checkbox" checked={this.state.fill} onChange={() => { }} /> fill </Horizontal>
          <Horizontal onClick={() => this.switchFlag('border')}><input key="border" type="checkbox" checked={this.state.border} onChange={() => { }} /> scene bounds </Horizontal>
          <Horizontal onClick={() => this.switchFlag('middle')}><input key="middle" type="checkbox" checked={this.state.middle} onChange={() => { }} /> middle bounds </Horizontal>
        </SideBar>
        {this.state.tab === 'polygons' && selectedP && <PolygonFullItem item={selectedP} submit={() => { }} />}
        {this.state.tab === 'animations' && selectedA && <AnimationFullItem item={selectedA} submit={() => { }} />}
        <StyledScene blur={this.state.blur} animation={this.animation()}>
          {this.polygonsToSvg()}
        </StyledScene>

      </Root>
    );
  }
}
