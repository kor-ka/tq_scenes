import * as React from 'react';
import * as glamor from 'glamor';
import Glamorous, { Time } from 'glamorous';
import { isUndefined } from 'util';

const StyledScene = Glamorous.div<{ blur: boolean, animation?: any }>((props) => ({
  display: 'flex',
  transform: props.blur ? 'scale(1.2) translate3d(0, 0, 0) translateZ(0)' : 'translate3d(0, 0, 0) translateZ(0)',
  filter: props.blur ? 'blur(25px)' : undefined,
  ...(props.animation || {})
}));

const Horizontal = Glamorous.div<{ justifyContent?: string, width?: any, zIndex?: number }>(props => ({
  width: props.width,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: props.justifyContent || 'start',
  padding: 5,
  zIndex: props.zIndex
}));

const HorizontalSB = Glamorous(Horizontal)({
  justifyContent: 'space-between'
});

const Vertical = Glamorous.div<{ justifyContent?: string, width?: any, zIndex?: number }>(props => ({
  width: props.width,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: props.justifyContent || 'start',
  padding: 5,
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
  flexShrink: 0,
  maxHeight: 'calc(100%  - 150px)',
  background: '#efefef',
  overflowY: 'scroll'
});

const SidebarListItemStyled = Glamorous.div<{ selected?: boolean }>(props => ({
  padding: 10,
  minHeight: 48,
  display: 'flex',
  backgroundColor: props.selected ? '#e5e5e5' : undefined,
  justifyContent: 'space-between',
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
  animation?: string;
}

class AnimatonStep {
  timing: number;
  opacity?: number;
  translate?: { x: number, y: number }
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
    translate: { x: 0, y: 0 }
  },
  {
    timing: 50,
    translate: { x: 10, y: -10 }
  },
  {
    timing: 100,
    translate: { x: 0, y: 0 }
  }],
  time: 5
};



class PolygonsListItem extends React.Component<{ item: Polygon, selected?: boolean, onClick: (id: string) => void }> {
  render() {
    return (
      <SidebarListItemStyled onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
        <div style={{ width: 'calc(100% - 48px)', overflow: 'hidden' }}>{this.props.item.name}</div>
        <div style={{ height: 48, width: 48, borderStyle: 'solid', borderWidth: 1, borderColor: '#cccccc' }}>
          <StyledScene blur={false} >
            {polygonsToSvg([this.props.item], false, true)}
          </StyledScene>
        </div>
      </SidebarListItemStyled>
    );
  }
}

class AnimationListItem extends React.Component<{ item: Animation, selected?: boolean, onClick: (id: string) => void }> {
  render() {
    let p = {
      id: 'polygon_1',
      name: 'polygon42',
      points: [200, 200, 400, 200, 400, 400, 200, 400],
      fill: '0365B7',
      animation: this.props.item.id,
    }
    return (
      <SidebarListItemStyled onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
        <div style={{ width: 'calc(100% - 48px)', overflow: 'hidden' }}>{this.props.item.name}</div>
        <div style={{ height: 48, width: 48, borderStyle: 'solid', borderWidth: 1, borderColor: '#cccccc' }}>
          <StyledScene blur={false} animation={animation([this.props.item], [p])}>
            {polygonsToSvg([p], false, true)}
          </StyledScene>
        </div>
      </SidebarListItemStyled>
    );
  }
}


class PolygonFullItem extends React.Component<{ item: Polygon, animations: Animation[], submit: (item: Polygon) => void, delete: (id: string) => void }> {
  render() {
    let res: Polygon = { ...this.props.item };
    return (
      <Vertical width="20%">
        <HorizontalSB>
          name:
                <input value={res.name} onChange={(v) => {
            res.name = v.target.value;
            this.props.submit(res)
          }} />
        </HorizontalSB>
        <HorizontalSB>
          fill:
                <input value={res.fill === undefined ? '' : res.fill} onChange={(v) => {
            res.fill = v.target.value === '' ? undefined : v.target.value;
            this.props.submit(res)
          }} />
        </HorizontalSB>
        <HorizontalSB>
          opacity:
                <input value={res.opacity === undefined ? '' : res.opacity} onChange={(v) => {
            res.opacity = v.target.value === '' ? undefined : Number(v.target.value);
            this.props.submit(res)
          }} />
        </HorizontalSB>

        <HorizontalSB>
          animation:
          <select value={this.props.item.animation} onChange={v => {
            res.animation = v.target.value;
            this.props.submit(res);
          }}>
          <option value=''>none</option>
            {this.props.animations.map(a => <option value={a.id}>{a.name}</option>)}
          </select>
        </HorizontalSB>
        <Horizontal>path: {this.props.item.points.join(" ")}</Horizontal>

        <button onClick={() => this.props.delete(this.props.item.id)}>Delete</button>
      </Vertical>
    );
  }
}

class AnimationFullItem extends React.Component<{ item: Animation, submit: (item: Animation) => void, delete: (id: string) => void }> {

  render() {
    let res: Animation = { ...this.props.item };
    return (
      <Vertical width="20%">
        <HorizontalSB>
          name:
           <input value={this.props.item.name} onChange={(v) => {
            res.name = v.target.value
            this.props.submit(res)
          }} />
        </HorizontalSB>

        <HorizontalSB>
          time:
           <input value={this.props.item.time} onChange={(v) => {
            res.time = Number(v.target.value) || 0;
            this.props.submit(res)
          }} />
        </HorizontalSB>

        <HorizontalSB> steps: </HorizontalSB>
        {this.props.item.steps.map((s, k) => (
          <Vertical key={k} >
            <HorizontalSB>
              timing:
              <input value={res.steps[k].timing} onChange={(v) => {
                res.steps[k].timing = Number(v.target.value) || 0;
                this.props.submit(res)
              }} />
            </HorizontalSB>
            <HorizontalSB>
              opacity:
                <input value={res.steps[k].opacity === undefined ? '' : res.steps[k].opacity} onChange={(v) => {
                res.steps[k].opacity = v.target.value === '' ? undefined : Number(v.target.value);
                this.props.submit(res)
              }} />
            </HorizontalSB>
            <Vertical>
              translate
                <HorizontalSB>
                x: <input value={res.steps[k].translate === undefined ? '' : res.steps[k].translate.x} onChange={(v) => {
                  res.steps[k].translate = { x: v.target.value === '' ? undefined : Number(v.target.value), y: res.steps[k].translate ? res.steps[k].translate.y : undefined }
                  this.props.submit(res)
                }} />
              </HorizontalSB>
              <HorizontalSB>
                y: <input value={res.steps[k].translate === undefined ? '' : res.steps[k].translate.y} onChange={(v) => {
                  res.steps[k].translate = { y: v.target.value === '' ? undefined : Number(v.target.value), x: res.steps[k].translate ? res.steps[k].translate.x : undefined }
                  this.props.submit(res)
                }} />
              </HorizontalSB>
            </Vertical>
          </Vertical>
        ))}
        <button onClick={() => this.props.delete(this.props.item.id)}>Delete</button>
      </Vertical>
    );
  }
}



class EditorState {
  tab: 'polygons' | 'animations';
  blur?: boolean
  fill?: boolean
  animate: boolean
  border: boolean
  middle?: boolean
  selectedP?: string;
  selectedA?: string;
  polygons: Polygon[];
  animations: Animation[];
}

const polygonsToSvg = (polygons: Polygon[], fill?: boolean, border?: boolean, middle?: boolean) => {
  console.warn(this.state);

  return (
    <svg height="100%" width="100%" viewBox="0 0 600 600" {...(fill ? { preserveAspectRatio: "xMidYMid slice" } : {})}>
      {border && <rect key='border' id='border' x="0" y="0" width="600" height="600" fill="none" style={{ stroke: 'gray', strokeWidth: 1, opacity: 0.5 }} />}
      {polygons.map(polygon =>
        <polygon key={polygon.id} id={polygon.id} fill={"#" + polygon.fill} opacity={polygon.opacity} points={polygon.points.join(" ")} />
      )}
      {middle && <rect key='middlev' id='middlev' x="200" y="0" width="200" height="600" fill="none" style={{ stroke: 'gray', strokeWidth: 1, opacity: 0.5 }} />}
      {middle && <rect key='middleh' id='middleh' x="0" y="200" width="600" height="200" fill="none" style={{ stroke: 'gray', strokeWidth: 1, opacity: 0.5 }} />}
    </svg>)
}

const animation = (anims: Animation[], polygons: Polygon[]) => {
  let animationsKeyframes: any = {};
  let animations: any = {};
  for (let a of anims) {
    let keyframes: any = {}
    for (let s of a.steps) {
      keyframes[s.timing + "%"] = {
        opacity: s.opacity,
        transform: s.translate ? 'translate3d(' + s.translate.x + '%, ' + s.translate.y + '%, 0)' : undefined,
      }
    }
    animationsKeyframes[a.id] = glamor.keyframes({
      ...keyframes
    });
    animations[a.id] = a
  }

  let animation: any = {};

  for (let p of polygons) {
    if (p.animation && animations[p.animation]) {
      animation['& #' + p.id] = {
        animation: `${animationsKeyframes[p.animation]} ${animations[p.animation].time}s infinite`
      }
    }
  }

  return animation;

}

export class SceneEditor extends React.Component<{}, EditorState> {
  constructor(props: EditorState) {
    super(props);
    let polygons = [polygonItem, polygonItem2];
    let animations = [glow, move];
    this.state = {
      tab: 'polygons',
      polygons: polygons,
      border: true,
      animations: animations,
      selectedP: polygons.length > 0 ? polygons[0].id : undefined,
      selectedA: animations.length > 0 ? animations[0].id : undefined,
      animate: true
    };
  }

  switchFlag(key: string) {
    let state: any = {};
    state[key] = !this.state[key];
    this.setState(state);
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
            {this.state.tab === 'polygons' && this.state.polygons.map(p => <PolygonsListItem key={p.name} item={p} onClick={id => {
              this.setState({
                selectedP: id
              })
            }} selected={this.state.selectedP === p.id} />)}

            {this.state.tab === 'animations' && this.state.animations.map(p => <AnimationListItem key={p.name} item={p} onClick={id => {
              this.setState({
                selectedA: id
              })
            }} selected={this.state.selectedA === p.id} />)}
            <Horizontal>
              <button onClick={() => {
                if (this.state.tab === 'animations') {
                  let id = 'animation_' + new Date().getMilliseconds();
                  this.state.animations.push({
                    id: id,
                    name: 'animation',
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
                  })
                  this.setState({
                    animations: this.state.animations,
                    selectedA: id,
                  })
                }
                if (this.state.tab === 'polygons') {
                  let id = 'polygon_' + new Date().getMilliseconds();
                  this.state.polygons.push({
                    id: id,
                    name: 'polygon',
                    points: [200, 200, 400, 200, 400, 400, 200, 400],
                    fill: '03FF00',
                  })
                  this.setState({
                    polygons: this.state.polygons,
                    selectedP: id,
                  })
                }

              }}>Add</button>
            </Horizontal>
          </SidebarList>
          <Vertical >
            <Horizontal onClick={() => this.switchFlag('blur')}><input key="blur" type="checkbox" checked={this.state.blur} onChange={() => { }} /> blur </Horizontal>
            <Horizontal onClick={() => this.switchFlag('fill')}><input key="fill" type="checkbox" checked={this.state.fill} onChange={() => { }} /> fill </Horizontal>
            <Horizontal onClick={() => this.switchFlag('border')}><input key="border" type="checkbox" checked={this.state.border} onChange={() => { }} /> scene bounds </Horizontal>
            <Horizontal onClick={() => this.switchFlag('middle')}><input key="middle" type="checkbox" checked={this.state.middle} onChange={() => { }} /> middle bounds </Horizontal>
            <Horizontal onClick={() => this.switchFlag('animate')}><input key="animate" type="checkbox" checked={this.state.animate} onChange={() => { }} /> animate </Horizontal>
          </Vertical>
        </SideBar>
        {this.state.tab === 'polygons' && selectedP && <PolygonFullItem animations={this.state.animations} item={selectedP} delete={toDelete => this.setState({polygons: this.state.polygons.filter(p => p.id !== toDelete)})} submit={(changed) => this.setState({ polygons: [...this.state.polygons].map(old => old.id === changed.id ? changed : old) })} />}
        {this.state.tab === 'animations' && selectedA && <AnimationFullItem item={selectedA} delete={toDelete => this.setState({animations: this.state.animations.filter(p => p.id !== toDelete)})} submit={(changed) => this.setState({ animations: [...this.state.animations].map(old => old.id === changed.id ? changed : old) })} />}
        <div style={{ flexGrow: 1 }} >
          <StyledScene blur={this.state.blur} animation={this.state.animate ? animation(this.state.animations, this.state.polygons) : undefined}>
            {polygonsToSvg(this.state.polygons, this.state.fill, this.state.border, this.state.middle)}
          </StyledScene>
        </div>


      </Root >
    );
  }
}
