import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as glamor from 'glamor';
import Glamorous from 'glamorous';
import { SketchPicker as SketchPickerRaw } from 'react-color';
import { getUid } from './utils/id';
import { ScenePicker } from './scenePicker';
import { Scenes } from './app';

const SketchPicker = Glamorous(SketchPickerRaw)({
  boxShadow: 'none !important',
  width: '226 !important',
  border: 'solid 1px #3E5C6B',
  borderRadius: 8

});


const StyledScene = Glamorous.div<{ blur: boolean, animation?: any, grid: boolean }>((props) => ({
  backgroundImage: props.grid ? 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/grid.png)' : undefined,
  backgroundSize: '16px 16px',
  display: 'flex',
  transform: props.blur ? 'scale(1.2) translate3d(0, 0, 0) translateZ(0)' : 'translate3d(0, 0, 0) translateZ(0)',
  filter: props.blur ? 'blur(25px)' : undefined,
  ...(props.animation || {})
}));

export const Button = Glamorous.button<{ color?: string, active?: boolean }>(props => ({
  cursor: 'pointer',
  padding: 8,
  color: props.color || '#3E5C6B',
  borderStyle: 'solid',
  borderWidth: 1,
  backgroundColor: 'transparent',
  borderColor: props.color || '#3E5C6B',
  borderRadius: 8,
  minHeight: 40,
  ':hover': {
    backgroundColor: props.color || '#3E5C6B',
    color: 'white',
  },
  ':disabled': {
    cursor: 'default',
    backgroundColor: 'gray',
    opacity: 0.7,
    color: 'white',
    borderColor: 'gray',
    ...(props.active ? {
      backgroundColor: props.color || '#3E5C6B',
      color: 'white',
      opacity: 1,
      borderColor: props.color || '#3E5C6B',
    } : {
        opacity: 0.2,

      })
  },
  ':focus': {
    outline: 0
  },

}));

export const Select = Glamorous.select({
  border: 'solid 1px #3E5C6B',
  borderRadius: 8,
  height: 40,
  minHeight: 40,
  background: 'transparent',
  outline: 0
});

export const Input = Glamorous.input({
  minHeight: 24,
  outline: 0,
  borderWidth: '0 0 1px',
  borderColor: '#3E5C6B',
  backgroundColor: 'transparent'
});

export const TextArea = Glamorous.textarea({
  minHeight: 24,
  outline: 0,
  borderWidth: '0 0 1px',
  borderColor: '#3E5C6B',
  backgroundColor: 'transparent'
});

export const Horizontal = Glamorous.div<{
  height?: any,
  justifyContent?: string,
  alignItems?: string,
  width?: any,
  zIndex?: number,
  divider?: number,
  scrollable?: boolean,
  padding?: string,
  flex?: number
}>(props => ({
  height: props.height,
  padding: props.padding,
  width: props.width,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: props.justifyContent,
  alignItems: props.alignItems,
  zIndex: props.zIndex,
  flexShrink: 0,
  flex: props.flex,
  overflowY: props.scrollable ? 'scroll' : undefined,
  '> *': {
    marginLeft: props.divider !== undefined ? props.divider : 8,
    marginRight: props.divider !== undefined ? props.divider : 8
  },
  '>:first-child': {
    marginLeft: 0,
  },
  '>:last-child': {
    marginRight: 0,
  }
}));

const Field = Glamorous(Horizontal)({
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const Vertical = Glamorous.div<{
  height?: any,
  justifyContent?: string,
  alignItems?: string,
  width?: any,
  zIndex?: number,
  divider?: number,
  scrollable?: boolean,
  padding?: string,
  flex?: number
}>(props => ({
  padding: props.padding,
  width: props.width,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: props.justifyContent,
  alignItems: props.alignItems,
  zIndex: props.zIndex,
  flexShrink: 0,
  flex: props.flex,
  overflowY: props.scrollable ? 'scroll' : undefined,
  '> *': {
    marginTop: props.divider !== undefined ? props.divider : 8,
    marginBottom: props.divider !== undefined ? props.divider : 8
  },
  '>:first-child': {
    marginTop: 0,
  },
  '>:last-child': {
    marginBottom: 0,
  }
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
  width: 170,
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
  background: '#f7f7f7',
});

const SidebarListItemStyled = Glamorous.div<{ selected?: boolean, dragOver?: boolean }>(props => ({
  padding: 16,
  display: 'flex',
  flexShrink: 0,
  backgroundColor: props.selected ? '#efefef' : undefined,
  justifyContent: 'space-between',
  alignItems: 'center',
  ':hover': {
    background: '#f3f3f3'
  },
  borderTop: props.dragOver ? 'dashed 1px black' : '',
}));

const flatPointsToPoints = (poinst: number[]) => {
  return poinst.reduce(
    (prev: { x: number, y: number }[], current: number, i: number) => {
      if (i % 2 === 0) {
        prev.push({ x: current, y: undefined });
      } else {
        prev[prev.length - 1].y = current;
      }
      return prev;
    },
    [])
}

export class Polygon {
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
export class Animation {
  id: string;
  name: string;
  steps: AnimatonStep[];
  time: number;
}

const polygonItem = {
  id: 'polygon_1',
  name: 'polygon42',
  points: [100, 100, 200, 100, 200, 200, 100, 200],
  fill: '#FF84ED',
  animation: 'animation_2'
};


const polygonItem2 = {
  id: 'polygon_2',
  name: 'just polygon',
  points: [200, 200, 400, 200, 400, 400, 200, 400],
  fill: '#00FFA2',
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

let getBox = (points: { x: number, y: number }[]) => {
  return points.reduce((accum: { minX?: number, minY?: number, maxX?: number, maxY?: number }, point: { x: number, y: number }) => {
    return {
      minX: accum.minX === undefined ? point.x : Math.min(accum.minX, point.x),
      minY: accum.minY === undefined ? point.y : Math.min(accum.minY, point.y),
      maxX: accum.maxX === undefined ? point.x : Math.max(accum.maxX, point.x),
      maxY: accum.maxY === undefined ? point.y : Math.max(accum.maxY, point.y)
    };
  }, { minX: undefined, minY: undefined, maxX: undefined, maxY: undefined });

}

let polygonFillScene = (p: Polygon) => {
  let points = flatPointsToPoints(p.points);
  let box = getBox(points);

  // move to 0,0
  points = points.map(p => ({ x: p.x - box.minX, y: p.y - box.minY }));

  // fill space
  let w = box.maxX - box.minX;
  let h = box.maxY - box.minY;
  let density = 500 / Math.max(w, h);
  points = points.map(p => ({ x: p.x * density, y: p.y * density }));

  // move to center
  box = getBox(points);
  w = box.maxX - box.minX;
  h = box.maxY - box.minY;
  let offsetX = (600 - w) / 2;
  let offsetY = (600 - h) / 2;
  points = points.map(p => ({ x: p.x + offsetX, y: p.y + offsetY }));

  let flatPoints = [];
  for (let p of points) {
    flatPoints.push(p.x, p.y)
  }


  return { ...p, points: flatPoints }
}


class PolygonsListItem extends React.Component<{ item: Polygon, index: number, selected?: boolean, onClick: (id: string) => void, move: (from: number, to: number) => void }, { dragOver: boolean, dragging: boolean }> {
  static anyDragged = false;
  constructor(props: any) {
    super(props);
    this.state = { dragOver: false, dragging: false };
  }

  onDragStart = (e) => {
    PolygonsListItem.anyDragged = true;
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
    console.warn(index, this.props.index)
    this.props.move(index, this.props.index)
    this.setState({ dragOver: false })
  }

  render() {
    return (
      <Vertical onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <SidebarListItemStyled dragOver={this.state.dragOver && PolygonsListItem.anyDragged} draggable={true} onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>

          <Vertical style={{ width: 'calc(100% - 48px)', overflow: 'hidden' }} >
            <div>{this.props.item.name}</div>
          </Vertical>
          <div style={{ height: 48, width: 48 }}>
            <StyledScene blur={false} grid={true}>
              {polygonsToSvg([polygonFillScene(this.props.item)])}
            </StyledScene>
          </div>
        </SidebarListItemStyled>
      </Vertical>
    );
  }
}

class AnimationListItem extends React.Component<{ item: Animation, selected?: boolean, onClick: (id: string) => void }> {
  render() {
    let p = {
      id: 'polygon_1',
      name: 'polygon42',
      points: [200, 200, 400, 200, 400, 400, 200, 400],
      fill: 'black',
      animation: this.props.item.id,
    }

    return (
      <SidebarListItemStyled onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
        <div style={{ width: 'calc(100% - 48px)', overflow: 'hidden' }}>{this.props.item.name}</div>
        <div style={{ height: 48, width: 48 }}>
          <StyledScene blur={false} animation={animation([this.props.item], [p])} grid={true}>
            {polygonsToSvg([p])}
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

class PolygonFullItem extends React.Component<{ item: Polygon, animations: Animation[], submit: (item: Polygon) => void, delete: (id: string) => void, copy: (id: string) => void, move: (from: number, to: number) => void, isLast: boolean, index: number }> {


  render() {
    let res: Polygon = { ...this.props.item };


    return (
      <Vertical style={{
        paddingLeft: 16,
        paddingRight: 16,
        flexShrink: 0,
        paddingTop: 16,
        overflowY: 'scroll',
        maxHeight: '100%',
        width: 248,
        zIndex: 1,
        background: 'white'
      }}>
        <Input value={res.name} onChange={(v: any) => {
          res.name = v.target.value;
          this.props.submit(res)
        }} />

        <SketchPicker
          color={{ r: hexToR(res.fill), g: hexToG(res.fill), b: hexToB(res.fill), a: res.opacity }}
          onChangeComplete={c => {
            res.fill = c.hex;
            res.opacity = c.hsl.a;
            this.props.submit(res)
          }}
        />

        <select style={{
          border: 'solid 1px #3E5C6B',
          borderRadius: 8,
          height: 40,
          minHeight: 40,
          background: 'transparent',
          outline: 0
        }} value={this.props.item.animation || ''} onChange={v => {
          res.animation = v.target.value;
          this.props.submit(res);
        }}>
          <option value=''>no animtation</option>
          {this.props.animations.map(a => <option key={a.id} value={a.id}>animation: {a.name}</option>)}
        </select>
        {/* <Horizontal>path: {this.props.item.points.join(" ")}</Horizontal> */}
        <Horizontal >
          <Button onClick={() => {
            this.props.move(this.props.index, this.props.index - 1);
          }} disabled={this.props.index === 0}> <i className="material-icons">flip_to_front</i> </Button>
          <Button onClick={() => {

            this.props.move(this.props.index, this.props.index + 1);
          }} disabled={this.props.isLast}> <i className="material-icons">flip_to_back</i> </Button>
          <Button key={'copy'} color='#3E5C6B' onClick={() => this.props.copy(this.props.item.id)}><i className="material-icons">file_copy</i></Button>

        </Horizontal>


        <Button key={'delete'} color='red' onClick={() => this.props.delete(this.props.item.id)}><i className="material-icons">delete</i> </Button>

      </Vertical>
    );
  }
}

class AnimationFullItem extends React.Component<{ item: Animation, submit: (item: Animation) => void, copy: (id: string) => void, delete: (id: string) => void }> {

  render() {
    let res: Animation = { ...this.props.item };
    let stepsTime = 0;
    let i = 0;
    for (let s of this.props.item.steps) {
      stepsTime += s.timing;
    }
    return (
      <Vertical style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        width: 248,
        flexShrink: 0,
        overflowY: 'scroll',
        maxHeight: '100%',
        marginBottom: 0,
        zIndex: 1,
        background: 'white'
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
          <Vertical key={'step_' + k}>
            {k === 0 && (
              <div style={{
                borderRadius: 10,
                border: '1px solid #3E5C6B',
                alignSelf: 'center',
                flexShrink: 0,
                color: '#3E5C6B',
                padding: 8
              }} >start</div>
            )}
            <div style={{
              height: 100 * step.timing / stepsTime,
              width: 0,
              border: '1px solid #3E5C6B',
              alignSelf: 'center',
              flexShrink: 0
            }} />
            <Vertical key={k} style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#3E5C6B', borderRadius: 8, padding: 8 }}>
              <Field>
                delay:
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
                  <Button onClick={() => {
                    res.steps.splice(k - 1, 0, res.steps.splice(k, 1)[0])
                    this.props.submit(res)
                  }} disabled={k === 0}> <i className="material-icons">keyboard_arrow_up</i> </Button>
                  <Button onClick={() => {
                    res.steps.splice(k + 1, 0, res.steps.splice(k, 1)[0])
                    this.props.submit(res)
                  }} disabled={k === res.steps.length - 1}> <i className="material-icons">keyboard_arrow_down</i> </Button>
                  <Button color='red' onClick={() => {
                    res.steps.splice(k, 1)
                    this.props.submit(res)
                  }}> <i className="material-icons">delete</i>  </Button>
                </Horizontal>

              </Vertical>
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
        }}> <i className="material-icons">add</i></Button>

        <Field style={{ marginBottom: 16 }}>
          <Button color='#3E5C6B' onClick={() => this.props.copy(this.props.item.id)}><i className="material-icons">file_copy</i> </Button>
          <Button color='red' onClick={() => this.props.delete(this.props.item.id)}><i className="material-icons">delete</i> </Button>
        </Field>
      </Vertical>
    );
  }
}



export class EditorState {
  selectedScene?: string;
  tab: 'polygons' | 'animations' | 'settings' | 'picker';
  blur?: boolean;
  fill?: boolean;
  animate: boolean;
  dragCircles: boolean;
  border: boolean;
  grid: boolean;
  middle?: boolean;
  selectedP?: string;
  selectPSource?: 'list' | 'scene';
  selectedA?: string;
  polygons: Polygon[];
  animations: Animation[];
}

// TODO extract to class
var svg, selectedElement, offset, dargCircle, dargPolygon, selectedParselId, polygonCenter, lastCoords;

function getMousePosition(evt) {
  var CTM = svg.getScreenCTM();
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

//TODO move to utils
var center = (arr) => {
  var minX, maxX, minY, maxY;
  for (var i = 0; i < arr.length; i++) {
    minX = (arr[i].x < minX || minX == null) ? arr[i].x : minX;
    maxX = (arr[i].x > maxX || maxX == null) ? arr[i].x : maxX;
    minY = (arr[i].y < minY || minY == null) ? arr[i].y : minY;
    maxY = (arr[i].y > maxY || maxY == null) ? arr[i].y : maxY;
  }

  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

function startDrag(evt, touch) {
  if (evt.target.classList.contains('draggable')) {
    evt.preventDefault();
    selectedElement = evt.target;
    if (touch) {
      let x = evt.targetTouches[0].clientX * window.devicePixelRatio;
      let y = evt.targetTouches[0].clientY * window.devicePixelRatio;
      offset = { x: x, y: y };
    } else {
      offset = getMousePosition(evt);
    }

    if (selectedElement.tagName === 'circle') {
      offset.x -= parseFloat(selectedElement.getAttributeNS(null, "cx"));
      offset.y -= parseFloat(selectedElement.getAttributeNS(null, "cy"));
    }
    if (selectedElement.tagName === 'polygon') {
      polygonCenter = center(flatPointsToPoints(selectedElement.getAttributeNS(null, "points").split(' ').map(p => Number(p))));
      offset.x -= polygonCenter.x;
      offset.y -= polygonCenter.y;
    }
  }
}
function drag(evt) {
  if (selectedElement) {
    evt.preventDefault();
    var coord = getMousePosition(evt);
    applyDrag(coord);
  }
}

function dragTouch(evt) {
  let x = evt.targetTouches[0].clientX * window.devicePixelRatio;
  let y = evt.targetTouches[0].clientY * window.devicePixelRatio;
  if (selectedElement) {
    evt.preventDefault();
    var coord = { x: x, y: y };
    applyDrag(coord);

  } else {
    startDrag(evt, true);
  }
}

function applyDrag(coord, final?: boolean) {
  if (selectedElement.tagName === 'circle') {
    // Math.max(0, Math.min(coord.x - offset.x, 600)), Math.max(0, Math.min(coord.y - offset.y, 600))
    dargCircle(parseInt(selectedElement.getAttributeNS(null, "id").split('_point_')[1]), coord.x - offset.x, coord.y - offset.y, selectedParselId, final);
  } else if (selectedElement.tagName === 'polygon') {
    let newCenter = { x: coord.x - offset.x, y: coord.y - offset.y }
    dargPolygon(selectedParselId, { x: newCenter.x, y: newCenter.y }, final);
  }
  lastCoords = coord;
}

function endDrag(evt) {
  if (lastCoords) {
    applyDrag(lastCoords, true)
  }
  lastCoords = null;
  selectedElement = null;
}

function makeDraggable(target, parselId: string, dargCircleCallback: (pintId: number, x: number, y: number, selected: string, final: boolean) => void, dargPolygonCallback: (id: string, newCenter: { x: number, y: number }, final: boolean) => void) {
  svg = target;
  selectedParselId = parselId;
  dargCircle = dargCircleCallback;
  dargPolygon = dargPolygonCallback;
  if (svg === null) {
    return;
  }
  svg.removeEventListener('mousedown', startDrag);
  svg.removeEventListener('mousemove', drag);
  svg.removeEventListener('mouseup', endDrag);
  svg.removeEventListener('mouseleave', endDrag);


  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);

  svg.removeEventListener('touchmove', dragTouch);
  svg.removeEventListener('touchend', endDrag);


  svg.addEventListener('touchmove', dragTouch);
  svg.addEventListener('touchend', endDrag);
}

export const polygonsToSvg = (polygons: Polygon[], fill?: boolean, border?: boolean, middle?: boolean, dragCircles?: boolean, selected?: string, onSelect?: (id: string) => void, dragCallback?: (changedPolygonId: string, newPath: number[], final: boolean) => void) => {
  let polygonsReversed = [...polygons].reverse();

  let dots = []
  for (let polygon of polygons) {
    if (polygon.id === selected) {

      let points = flatPointsToPoints(polygon.points);

      let dotsInv = points.map((point, i) => <circle key={polygon.id + '_point_' + i} id={polygon.id + '_point_' + i} className="draggable" cursor="move" cx={point.x} cy={point.y} r='25' fill='transparent' stroke='black' strokeWidth='1' />)

      let dts = points.map((point, i) => <circle key={polygon.id + '_point_white_' + i} id={polygon.id + (dragCircles ? '_point_white_' : '_point_') + i} className="draggable" cursor="move" cx={point.x} cy={point.y} r='5' fill='white' stroke='black' strokeWidth='1' />)
      dots.push(...dts, ...(dragCircles ? dotsInv : []));
    }

  }


  return (

    <svg style={{ overflow: 'visible' }} height="100%" width="100%" viewBox="0 0 600 600" ref={ref => makeDraggable(ref, selected, (id, x, y, s, final) => {
      if (selected === s) {
        let newPath = [...polygons.filter(p => p.id === selected)[0].points]
        newPath[id * 2] = x;
        newPath[id * 2 + 1] = y;
        dragCallback(selected, newPath, final);
      }
    }, (selected: string, newCenter: { x: number, y: number }, final) => {
      let selectedPolygonPonts = polygons.filter(p => p.id === selected)[0].points;
      let oldCenter = center(flatPointsToPoints(selectedPolygonPonts));
      let newPath = selectedPolygonPonts.map((p, i) => p + (i % 2 === 0 ? newCenter.x - oldCenter.x : newCenter.y - oldCenter.y));
      dragCallback(selected, newPath, final);
    })} {...(fill ? { preserveAspectRatio: "xMidYMid slice" } : {})}>

      {polygonsReversed.map(polygon =>
        <polygon cursor={polygon.id === selected ? 'move' : 'default'} className={polygon.id === selected ? 'draggable' : undefined} key={polygon.id} id={polygon.id} fill={polygon.fill} opacity={polygon.opacity} points={polygon.points.join(" ")} onClick={ref => onSelect ? onSelect((ref.target as any).id) : undefined} />
      )}
      {middle && <rect key='middlev' id='middlev' x="200" y="0" width="200" height="600" fill="none" style={{ stroke: 'black', strokeWidth: 1 }} />}
      {middle && <rect key='middleh' id='middleh' x="0" y="200" width="600" height="200" fill="none" style={{ stroke: 'black', strokeWidth: 1 }} />}
      {middle && <rect key='middlev1' id='middlev' x="201" y="1" width="198" height="598" fill="none" style={{ stroke: 'white', strokeWidth: 1 }} />}
      {middle && <rect key='middleh2' id='middleh' x="1" y="201" width="598" height="198" fill="none" style={{ stroke: 'white', strokeWidth: 1 }} />}
      {border && <rect key='border' id='border' x="0" y="0" width="600" height="600" fill="none" style={{ stroke: 'black', strokeWidth: 1 }} />}
      {border && <rect key='border1' id='border' x="1" y="1" width="598" height="598" fill="none" style={{ stroke: 'white', strokeWidth: 1 }} />}
      {dots}
    </svg>)
}

export const animation = (anims: Animation[], polygons: Polygon[], selectedPolygonId?: string, dragCircles?: boolean) => {
  let animationsKeyframes: any = {};
  let animations: any = {};
  for (let a of anims) {
    let keyframes: any = {}

    let fullTime = 0;
    for (let s of a.steps) {
      fullTime += s.timing;
    }
    let sumTime = 0;
    for (let s of a.steps) {
      sumTime += s.timing
      keyframes[sumTime / fullTime * 100 + "%"] = {
        opacity: (s.opacity !== null && s.opacity !== undefined && s.opacity !== NaN) ? s.opacity / 100 : undefined,
        transform: s.translate ? 'translate3d(' + s.translate.x + '%, ' + s.translate.y * -1 + '%, 0)' : undefined,
      }

      // adding this boolshit just to restart animation => sync polygon animation with dots
      keyframes[selectedPolygonId + '_' + dragCircles] = {
        opacity: 0,
      }
    }
    animationsKeyframes[a.id] = glamor.keyframes({
      ...keyframes
    });
    animations[a.id] = a
  }

  let animationRes: any = {};

  for (let p of polygons) {
    if (p.animation && animations[p.animation]) {
      let toAnimate = ['& #' + p.id];
      if (p.id === selectedPolygonId) {
        for (let i = 0; i < p.points.length / 2; i++) {
          toAnimate.push('& #' + p.id + '_point_white_' + i);
          toAnimate.push('& #' + p.id + '_point_' + i);
        }
      }
      animationRes[toAnimate.join(', ')] = {
        animation: `${animationsKeyframes[p.animation]} ${animations[p.animation].time}s infinite`
      }
    }
  }
  return animationRes;

}

export class SceneEditor extends React.PureComponent<{ onChanged: (EditorState) => void, initialState: EditorState }, EditorState> {
  stateStack = [];
  undoPointer = 0;
  preventStackState = false;
  constructor(props: { onChanged: (EditorState) => void, initialState: EditorState }) {
    super(props);

    //recover editor state
    let editorState = props.initialState;

    // //initial scenes state
    // let scenes = editorState. || {};
    // if (!editorState.selectedScene) {
    //   editorState.selectedScene = Object.keys(scenes)[0];
    // }

    // let polygons = [polygonItem, polygonItem2];
    // let animations = [glow, move];
    // let selectedScene = scenes[editorState.selectedScene];
    // if (selectedScene) {
    //   polygons = selectedScene.polygons || polygons;
    //   animations = selectedScene.animations || animations;
    // }

    this.state = {
      tab: 'polygons',
      // polygons: polygons,
      border: true,
      grid: true,
      dragCircles: true,
      // animations: animations,
      // selectedP: polygons.length > 0 ? polygons[0].id : undefined,
      // selectedA: animations.length > 0 ? animations[0].id : undefined,
      animate: true,
      ...editorState
    };
    this.stateStack.push({ polygons: this.state.polygons, animations: this.state.animations });
  }

  componentWillUpdate(nextPros: {}, nexState: EditorState) {
    if (nexState.selectedScene !== this.state.selectedScene) {
      return;
    }
    let scrollToSelected = nexState.selectedP != this.state.selectedP && nexState.selectPSource === 'scene';

    if (!this.preventStackState && (nexState.animations !== this.state.animations || nexState.polygons !== this.state.polygons)) {
      if (this.undoPointer < this.stateStack.length - 1 && this.stateStack.length > 0) {
        this.stateStack.splice(this.undoPointer + 1, this.stateStack.length - this.undoPointer);
      }

      // TODO limit stack
      this.stateStack.push({ polygons: nexState.polygons, animations: nexState.animations });

      this.undoPointer = this.stateStack.length - 1;
      console.warn(this.undoPointer, this.stateStack);
    }
    this.preventStackState = false;

    if (scrollToSelected) {
      let polygonListItemElement = ReactDOM.findDOMNode(this.refs['polygonListItem_' + nexState.selectedP])
      let sidebar = ReactDOM.findDOMNode(this.refs.sidebar)
      if (sidebar && polygonListItemElement) {
        sidebar.scrollTo(0, sidebar.scrollTop + polygonListItemElement.getBoundingClientRect().top - 1);
        this.setState({ selectPSource: undefined });
      }
    }
  }

  componentDidUpdate() {

    this.props.onChanged(this.state);
  }

  switchFlag(key: string) {
    let state: any = {};
    state[key] = !this.state[key];
    this.setState(state);
  }

  export = () => {
    let sceneExport = 'data:text/json;charset=utf-8,';
    sceneExport += JSON.stringify({ scene: { polygons: this.state.polygons, animations: this.state.animations } });
    var encodedUri = encodeURI(sceneExport);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'untitled_scene' + '.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  import = (e: any) => {
    if (e.target.files[0]) {
      var reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");

      reader.onload = (evt: any) => {
        let scene = JSON.parse(evt.target.result);
        if (scene.scene.polygons && scene.scene.animations) {
          this.setState({ polygons: scene.scene.polygons, animations: scene.scene.animations })
        }
      }
    }

  }

  movePolygon = (from, to) => {
    let res = [...this.state.polygons]
    res.splice(to, 0, res.splice(from, 1)[0]);
    this.setState({
      polygons: res
    });
  }

  undo = () => {
    this.preventStackState = true;
    this.setState({
      ...this.stateStack[--this.undoPointer]
    })
  }

  redo = () => {
    this.preventStackState = true;
    console.warn(this.undoPointer)
    this.setState({
      ...this.stateStack[++this.undoPointer]
    })
  }

  render() {
    let selectedPIndex = -1;
    let selectedP = this.state.polygons.filter((p, i) => {
      selectedPIndex = selectedPIndex !== -1 ? selectedPIndex : this.state.selectedP === p.id ? i : -1;
      return p.id === this.state.selectedP;
    })[0];
    let selectedA = this.state.animations.filter(p => p.id === this.state.selectedA)[0];

    return (
      <Root>
        <Vertical style={{
          padding: 16,
          zIndex: 1,
          background: 'white'
        }} >
          <Vertical style={{ flexGrow: 1 }} >
            <Button onClick={() => this.setState({ tab: "polygons" })} disabled={this.state.tab === 'polygons'} active={true}><i className="material-icons">layers</i></Button>
            <Button onClick={() => this.setState({ tab: "animations" })} disabled={this.state.tab === 'animations'} active={true}><i className="material-icons">movie_filter</i></Button>
            <Button onClick={() => this.setState({ tab: "settings" })} disabled={this.state.tab === 'settings'} active={true}><i className="material-icons">settings</i></Button>
          </Vertical>
          <input style={{ opacity: 0, width: 1 }} type="file" id="file" onChange={this.import} />
          <Button onClick={this.undo} disabled={this.stateStack.length === 0 || this.undoPointer === 0}><i className="material-icons">undo</i></Button>
          <Button onClick={this.redo} disabled={this.undoPointer === this.stateStack.length - 1}><i className="material-icons">redo</i></Button>
          <Button onClick={() => this.setState({ tab: "picker" })} disabled={this.state.tab === 'picker'} active={true}><i className="material-icons">folder_open</i></Button>
          <Button ><label style={{ cursor: 'pointer' }} htmlFor="file" className="material-icons">publish</label></Button>
          <Button onClick={this.export} ><i className="material-icons">save_alt</i></Button>
        </Vertical>
        {(this.state.tab === 'polygons' || this.state.tab === 'animations') && (
          <SideBar style={{
            zIndex: 1,
          }}>

            <SidebarList ref='sidebar'>
              <Vertical>
                <Button style={{ margin: 16 }} onClick={() => {
                  if (this.state.tab === 'animations') {
                    let id = 'animation_' + new Date().getTime();
                    this.state.animations.unshift({
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
                    let id = 'polygon_' + new Date().getTime();
                    this.state.polygons.unshift({
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

                }}><i className="material-icons">add</i> </Button>
              </Vertical>
              {this.state.tab === 'polygons' && this.state.polygons.map((p, i) =>
                <PolygonsListItem
                  ref={'polygonListItem_' + p.id}
                  index={i}
                  move={this.movePolygon}
                  key={p.id}
                  item={p}
                  onClick={id => {
                    this.setState({
                      selectedP: id
                    })
                  }}
                  selected={this.state.selectedP === p.id} />)}

              {this.state.tab === 'animations' && this.state.animations.map(p =>
                <AnimationListItem key={p.id} item={p} onClick={id => {
                  this.setState({
                    selectedA: id
                  })
                }} selected={this.state.selectedA === p.id} />)}

            </SidebarList>
          </SideBar>
        )}

        {this.state.tab === 'polygons' && selectedP &&
          <PolygonFullItem
            index={selectedPIndex}
            isLast={selectedPIndex === this.state.polygons.length - 1}
            move={this.movePolygon}
            animations={this.state.animations}
            item={selectedP}
            copy={toCopy => {
              let res = [...this.state.polygons];
              let id = 'polygon_' + new Date().getTime();
              let original = this.state.polygons.filter(p => p.id === toCopy)[0];
              res.unshift({ ...original, id: id, points: [...original.points] });
              this.setState({ polygons: res, selectedP: id });
            }} delete={toDelete => this.setState({ polygons: this.state.polygons.filter(p => p.id !== toDelete) })} submit={(changed) => this.setState({ polygons: [...this.state.polygons].map(old => old.id === changed.id ? changed : old) })} />}
        {this.state.tab === 'animations' && selectedA &&
          <AnimationFullItem copy={toCopy => {
            let res = [...this.state.animations];
            let id = 'animation_' + new Date().getTime();
            let original = this.state.animations.filter(p => p.id === toCopy)[0];
            res.unshift({ ...original, id: id, steps: original.steps.map(s => ({ ...s, translate: { ...s.translate } })) });
            this.setState({ animations: res, selectedA: id });
          }} item={selectedA} delete={toDelete => this.setState({ animations: this.state.animations.filter(p => p.id !== toDelete) })} submit={(changed) => this.setState({ animations: [...this.state.animations].map(old => old.id === changed.id ? changed : old) })} />}
        {this.state.tab === 'settings' && (
          <Vertical style={{ padding: 10, zIndex: 1, background: 'white' }}>
            <Horizontal onClick={() => this.switchFlag('blur')}><Input key="blur" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.blur)} onChange={() => { }} />blur </Horizontal>
            <Horizontal onClick={() => this.switchFlag('fill')}><Input key="fill" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.fill)} onChange={() => { }} />fill </Horizontal>
            <Horizontal onClick={() => this.switchFlag('grid')}><Input key="grid" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.grid)} onChange={() => { }} />grid </Horizontal>
            <Horizontal onClick={() => this.switchFlag('border')}><Input key="border" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.border)} onChange={() => { }} />scene bounds </Horizontal>
            <Horizontal onClick={() => this.switchFlag('middle')}><Input key="middle" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.middle)} onChange={() => { }} />middle bounds </Horizontal>
            <Horizontal onClick={() => this.switchFlag('animate')}><Input key="animate" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.animate)} onChange={() => { }} />animate </Horizontal>
            <Horizontal onClick={() => this.switchFlag('dragCircles')}><Input key="dragCircles" type="checkbox" style={{ marginRight: 8 }} checked={!!(this.state.dragCircles)} onChange={() => { }} />dragCircles </Horizontal>
          </Vertical>
        )}
        {this.state.tab === 'picker' && (
          <ScenePicker create={true} onclick={id => {
            if (id !== this.state.selectedScene) {
              let scenes = JSON.parse(window.localStorage.getItem('scenes')) || {};

              let selectedScene = scenes[id];
              if (selectedScene) {
                let polygons = selectedScene.polygons || [];
                let animations = selectedScene.animations || [];
                this.setState({
                  polygons: polygons,
                  animations: animations,
                  selectedA: undefined,
                  selectedP: undefined,
                  selectedScene: id,
                });
              }
            }
          }} />
        )}
        <StyledScene style={{
          flexGrow: 1,
        }} blur={this.state.blur} grid={this.state.grid} animation={this.state.animate ? animation(this.state.animations, this.state.polygons, this.state.selectedP, this.state.dragCircles) : undefined}>
          {polygonsToSvg(this.state.polygons, this.state.fill, this.state.border, this.state.middle, this.state.dragCircles, this.state.selectedP, (id) => { this.setState({ selectedP: id, selectPSource: 'scene' }) }, (changedPolygonId, newPath, final) => {
            let changed = { ...this.state.polygons.filter(p => p.id === changedPolygonId)[0] };
            changed.points = newPath;
            this.preventStackState = !final;
            this.setState({ polygons: [...this.state.polygons].map(old => old.id === changedPolygonId ? changed : old) })
          })}
        </StyledScene>
      </Root >
    );
  }
}
