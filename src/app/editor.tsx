import * as React from 'react';
import * as glamor from 'glamor';
import Glamorous, { Time } from 'glamorous';
import { SketchPicker, AlphaPicker } from 'react-color';

const StyledScene = Glamorous.div<{ blur: boolean, animation?: any, grid: boolean }>((props) => ({
  backgroundImage: props.grid ? 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/grid.png)' : undefined,
  backgroundSize: '16px 16px',
  display: 'flex',
  transform: props.blur ? 'scale(1.2) translate3d(0, 0, 0) translateZ(0)' : 'translate3d(0, 0, 0) translateZ(0)',
  filter: props.blur ? 'blur(25px)' : undefined,
  ...(props.animation || {})
}));

const Button = Glamorous.button<{ color?: string, active?: boolean }>(props => ({
  cursor: 'pointer',
  color: props.color || 'blue',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: props.color || 'blue',
  borderRadius: 8,
  minHeight: 24,
  ':hover': {
    backgroundColor: props.color || 'blue',
    color: 'white',
    opacity: 0.7
  },
  ':disabled': {
    cursor: 'default',
    backgroundColor: 'gray',
    color: 'white',
    borderColor: 'gray',
    ...(props.active ? {
      backgroundColor: props.color || 'blue',
      color: 'white',
      borderColor: props.color || 'blue',
    } : {})
  },
  ':focus': {
    outline: 0
  },

}));

const Input = Glamorous.input({
  minHeight: 24,
  outline: 0,
  borderWidth: '0 0 1px;',
  borderColor: 'blue'
});

const Horizontal = Glamorous.div<{ justifyContent?: string, width?: any, zIndex?: number }>(props => ({
  width: props.width,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: props.justifyContent || 'start',
  marginBottom: 10,
  zIndex: props.zIndex,
  flexShrink: 0,
}));

const Field = Glamorous(Horizontal)({
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: 10
});

const Vertical = Glamorous.div<{ justifyContent?: string, width?: any, zIndex?: number }>(props => ({
  width: props.width,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: props.justifyContent || 'start',
  marginBottom: 10,
  zIndex: props.zIndex,
  flexShrink: 0,
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
  overflowY: 'scroll',
  maxHeight: '100%',
  background: '#efefef',
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
  fill: '#0365B7',
  animation: 'animation_2'
};


const polygonItem2 = {
  id: 'polygon_2',
  name: 'just polygon',
  points: [500, 200, 100, 200, 300, 410],
  fill: '#03FF00',
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
        <div style={{ height: 48, width: 48 }}>
          <StyledScene blur={false} grid={true}>
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
        <div style={{ height: 48, width: 48 }}>
          <StyledScene blur={false} animation={animation([this.props.item], [p])} grid={true}>
            {polygonsToSvg([p], false, true)}
          </StyledScene>
        </div>
      </SidebarListItemStyled>
    );
  }
}


function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

class PolygonFullItem extends React.Component<{ item: Polygon, animations: Animation[], submit: (item: Polygon) => void, delete: (id: string) => void }> {
  render() {
    let res: Polygon = { ...this.props.item };
    return (
      <Vertical width="20%" style={{
        paddingLeft: 10,
        paddingRight: 10,
        flexShrink: 0,
        overflowY: 'scroll',
        maxHeight: '100%',
      }}>
        <Field>
          name:
                <Input value={res.name} onChange={(v: any) => {
            res.name = v.target.value;
            this.props.submit(res)
          }} />
        </Field>
        <Field>
          fill:

          <SketchPicker
            color={res.fill}
            onChangeComplete={c => {
              res.fill = c.hex;
              this.props.submit(res)
            }}
          />
        </Field>
        <Field>
          opacity:

          <AlphaPicker
            color={{ r: hexToR(res.fill), g: hexToG(res.fill), b: hexToB(res.fill), a: res.opacity }}
            onChangeComplete={c => {
              res.opacity = c.hsl.a;
              this.props.submit(res)
            }}
          />
        </Field>

        <Field>
          animation:
          <select value={this.props.item.animation} onChange={v => {
            res.animation = v.target.value;
            this.props.submit(res);
          }}>
            <option value=''>none</option>
            {this.props.animations.map(a => <option value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        {/* <Horizontal>path: {this.props.item.points.join(" ")}</Horizontal> */}

        <Field style={{ marginRight: 0 }}> <div></div><Button color='red' onClick={() => this.props.delete(this.props.item.id)}>Delete polygon</Button></Field>
      </Vertical>
    );
  }
}

class AnimationFullItem extends React.Component<{ item: Animation, submit: (item: Animation) => void, delete: (id: string) => void }> {

  render() {
    let res: Animation = { ...this.props.item };
    return (
      <Vertical width="20%" style={{
        paddingLeft: 10,
        paddingRight: 10,
        flexShrink: 0,
        overflowY: 'scroll',
        maxHeight: '100%',
        marginBottom: 0
      }}>
        <Field>
          name:
           <Input value={this.props.item.name} onChange={(v: any) => {
            res.name = v.target.value
            this.props.submit(res)
          }} />
        </Field>

        <Field>
          time:
           <Input value={this.props.item.time} onChange={(v: any) => {
            res.time = Number(v.target.value) || 0;
            this.props.submit(res)
          }} />
        </Field>

        <Field> STEPS: </Field>
        {this.props.item.steps.map((step, k) => (
          <Vertical key={k} style={{ borderStyle: 'solid', borderWidth: 1, borderColor: 'blue', borderRadius: 8 }}>
            <Field>
              timing:
              <Input value={step.timing} onChange={(v: any) => {
                step.timing = Number(v.target.value) || 0;
                this.props.submit(res)
              }} />
            </Field>
            <Field>
              opacity:
                <Input value={step.opacity === undefined ? '' : step.opacity} onChange={(v: any) => {
                step.opacity = v.target.value === '' ? undefined : Number(v.target.value);
                this.props.submit(res)
              }} />
            </Field>
            <Vertical>
              <Field>
                x: <Input value={step.translate === undefined ? '' : step.translate.x} onChange={(v: any) => {
                  step.translate = { x: v.target.value === '' ? undefined : Number(v.target.value), y: step.translate ? step.translate.y : undefined }
                  this.props.submit(res)
                }} />
              </Field>
              <Field>
                y: <Input value={step.translate === undefined ? '' : step.translate.y} onChange={(v: any) => {
                  step.translate = { y: v.target.value === '' ? undefined : Number(v.target.value), x: step.translate ? step.translate.x : undefined }
                  this.props.submit(res)
                }} />
              </Field>
              <Horizontal style={{ marginBottom: 0 }}>
                <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={() => {
                  res.steps.splice(k - 1, 0, res.steps.splice(k, 1)[0])
                  this.props.submit(res)
                }} disabled={k === 0}> Up </Button>
                <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={() => {
                  res.steps.splice(k + 1, 0, res.steps.splice(k, 1)[0])
                  this.props.submit(res)
                }} disabled={k === res.steps.length - 1}> Down </Button>
                <Button color='red' style={{ marginLeft: 10, marginRight: 10 }} onClick={() => {
                  res.steps.splice(k, 1)
                  this.props.submit(res)
                }}> Delete </Button>
              </Horizontal>

            </Vertical>
          </Vertical>
        ))}
        <Button onClick={() => {
          if (res.steps.length === 0) {
            res.steps.push({
              timing: 0,
              opacity: 0
            }),
              res.steps.push({
                timing: 100,
                opacity: 1
              })
          } else {
            res.steps.push({
              ...res.steps[res.steps.length - 1]
            })
          }

          this.props.submit(res)
        }}> + </Button>

        <Field style={{ marginRight: 0 }}><div></div><Button color='red' onClick={() => this.props.delete(this.props.item.id)}>Delete animation</Button></Field>

      </Vertical>
    );
  }
}



class EditorState {
  tab: 'polygons' | 'animations';
  blur?: boolean;
  fill?: boolean;
  animate: boolean;
  border: boolean;
  grid: boolean;
  middle?: boolean;
  selectedP?: string;
  selectedA?: string;
  polygons: Polygon[];
  animations: Animation[];
}

const polygonsToSvg = (polygons: Polygon[], fill?: boolean, border?: boolean, middle?: boolean) => {
  console.warn(this.state);

  return (
    <svg height="100%" width="100%" viewBox="0 0 600 600" {...(fill ? { preserveAspectRatio: "xMidYMid slice" } : {})}>
      {border && <rect key='border' id='border' x="0" y="0" width="600" height="600" fill="none" style={{ stroke: 'black', strokeWidth: 1 }} />}
      {border && <rect key='border1' id='border' x="1" y="1" width="598" height="598" fill="none" style={{ stroke: 'white', strokeWidth: 1 }} />}
      {polygons.map(polygon =>
        <polygon key={polygon.id} id={polygon.id} fill={polygon.fill} opacity={polygon.opacity} points={polygon.points.join(" ")} />
      )}
      {middle && <rect key='middlev' id='middlev' x="200" y="0" width="200" height="600" fill="none" style={{ stroke: 'black', strokeWidth: 1}} />}
      {middle && <rect key='middleh' id='middleh' x="0" y="200" width="600" height="200" fill="none" style={{ stroke: 'black', strokeWidth: 1}} />}
      {middle && <rect key='middlev1' id='middlev' x="201" y="1" width="198" height="598" fill="none" style={{ stroke: 'white', strokeWidth: 1}} />}
      {middle && <rect key='middleh2' id='middleh' x="1" y="201" width="598" height="198" fill="none" style={{ stroke: 'white', strokeWidth: 1}} />}
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
      grid: true,
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
        <Vertical style={{ padding: 10 }} >
          <Vertical ><Button onClick={() => this.setState({ tab: "polygons" })} disabled={this.state.tab === 'polygons'} active={true}>P</Button></Vertical >
          <Vertical ><Button onClick={() => this.setState({ tab: "animations" })} disabled={this.state.tab === 'animations'} active={true}>A</Button></Vertical >
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
            <Vertical>
              <Button style={{ margin: 10 }} onClick={() => {
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
                    fill: '#03FF00',
                  })
                  this.setState({
                    polygons: this.state.polygons,
                    selectedP: id,
                  })
                }

              }}>+</Button>
            </Vertical>
          </SidebarList>
        </SideBar>
        {this.state.tab === 'polygons' && selectedP && <PolygonFullItem animations={this.state.animations} item={selectedP} delete={toDelete => this.setState({ polygons: this.state.polygons.filter(p => p.id !== toDelete) })} submit={(changed) => this.setState({ polygons: [...this.state.polygons].map(old => old.id === changed.id ? changed : old) })} />}
        {this.state.tab === 'animations' && selectedA && <AnimationFullItem item={selectedA} delete={toDelete => this.setState({ animations: this.state.animations.filter(p => p.id !== toDelete) })} submit={(changed) => this.setState({ animations: [...this.state.animations].map(old => old.id === changed.id ? changed : old) })} />}
        <div style={{
          flexGrow: 1,
          zIndex: -1,
        }} >
          <StyledScene blur={this.state.blur} grid={this.state.grid} animation={this.state.animate ? animation(this.state.animations, this.state.polygons) : undefined}>
            {polygonsToSvg(this.state.polygons, this.state.fill, this.state.border, this.state.middle)}
          </StyledScene>
        </div>
        <Vertical style={{ padding: 10 }}>
          <Horizontal onClick={() => this.switchFlag('blur')}><Input key="blur" type="checkbox" checked={this.state.blur} onChange={() => { }} /> blur </Horizontal>
          <Horizontal onClick={() => this.switchFlag('fill')}><Input key="fill" type="checkbox" checked={this.state.fill} onChange={() => { }} /> fill </Horizontal>
          <Horizontal onClick={() => this.switchFlag('grid')}><Input key="grid" type="checkbox" checked={this.state.grid} onChange={() => { }} /> grid </Horizontal>
          <Horizontal onClick={() => this.switchFlag('border')}><Input key="border" type="checkbox" checked={this.state.border} onChange={() => { }} /> scene bounds </Horizontal>
          <Horizontal onClick={() => this.switchFlag('middle')}><Input key="middle" type="checkbox" checked={this.state.middle} onChange={() => { }} /> middle bounds </Horizontal>
          <Horizontal onClick={() => this.switchFlag('animate')}><Input key="animate" type="checkbox" checked={this.state.animate} onChange={() => { }} /> animate </Horizontal>
        </Vertical>

      </Root >
    );
  }
}
