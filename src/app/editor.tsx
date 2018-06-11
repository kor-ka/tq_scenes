import * as React from 'react';
import * as glamor from 'glamor';
import Glamorous from 'glamorous';

const StyledScene = Glamorous.div<{ blur: boolean }>((props) => ({
  display: 'flex',
  flexGrow: 1,
  transform: props.blur ? 'scale(1.2) translate3d(0, 0, 0) translateZ(0)' : 'translate3d(0, 0, 0) translateZ(0)',
  filter: props.blur ? 'blur(25px)' : undefined,
  border: 1,
}));

const Horizontal = Glamorous.div<{ zIndex?: number }>(props => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  padding: 10,
  zIndex: props.zIndex
}));

const Vertical = Glamorous.div<{ zIndex?: number }>(props => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: 10,
  zIndex: props.zIndex
}));


class Polygon {
  id: string;
  name: string;
  points: number[];
  fill: string;
  opacity?: number;
}

const Root = Glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

const polygonItem = {
  id: '42',
  name: 'polygon42',
  points: [0, 0, 500, 0, 450, 350],
  fill: '0365B7',

};

const SideBar = Glamorous.div({
  width: '30%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  zIndex: 1

});

const PolugonList = Glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  flexGrow: 1,
  background: '#efefef'


});

const PoligonItemListStyled = Glamorous.div<{ selected?: boolean }>(props => ({
  padding: 20,
  display: 'flex',
  backgroundColor: props.selected ? '#e5e5e5' : undefined,
  justifyContent: 'center',
  ':hover': {
    background: '#dedede'
  }
}));

class PolygonsListItem extends React.Component<{ item: Polygon, selected?: boolean, onClick: (id: string) => void }> {
  render() {
    return (
      <PoligonItemListStyled onClick={() => this.props.onClick(this.props.item.id)} selected={this.props.selected}>
        {this.props.item.id + " | " + this.props.item.name}
      </PoligonItemListStyled>
    );
  }
}

class EditorState {
  tab: 'paths' | 'animations';
  blur?: boolean
  fill?: boolean
  border: boolean
  middle?: boolean
  selected?: string;
  polygons: Polygon[];
}

export class SceneEditor extends React.Component<{}, EditorState> {
  constructor(props: EditorState) {
    super(props);
    this.state = { tab: 'paths', polygons: [polygonItem], border: true };
  }

  switchFlag(key: string) {
    let state: any = {};
    state[key] = !this.state[key];
    this.setState(state);
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

  onPolygonClick = (id: string) => {
    this.setState({
      selected: this.state.selected === id ? undefined : id
    });
  }

  render() {
    return (
      <Root>
        <StyledScene blur={this.state.blur}>
          {this.polygonsToSvg()}
        </StyledScene>
        <SideBar>
          <PolugonList>
            {this.state.polygons.map(p => <PolygonsListItem key={p.id} item={p} onClick={this.onPolygonClick} selected={this.state.selected === p.id} />)}
          </PolugonList>
          <Horizontal onClick={() => this.switchFlag('blur')}><input type="checkbox" checked={this.state.blur} /> blur </Horizontal>
          <Horizontal onClick={() => this.switchFlag('fill')}><input type="checkbox" checked={this.state.fill} /> fill </Horizontal>
          <Horizontal onClick={() => this.switchFlag('border')}><input type="checkbox" checked={this.state.border} /> scene bounds </Horizontal>
          <Horizontal onClick={() => this.switchFlag('middle')}><input type="checkbox" checked={this.state.middle} /> middle bounds </Horizontal>
        </SideBar>
      </Root>
    );
  }
}
