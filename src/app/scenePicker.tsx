import * as React from 'react';
import Glamorous from 'glamorous';
import { Vertical, Polygon, Animation, animation, polygonsToSvg, Button } from './editor';
import { getUid } from './utils/id';

const StyledScene = Glamorous.div<{ blur: boolean, animation?: any, grid: boolean }>((props) => ({
    backgroundImage: props.grid ? 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/grid.png)' : undefined,
    backgroundSize: '16px 16px',
    display: 'flex',
    transform: props.blur ? 'scale(1.2) translate3d(0, 0, 0) translateZ(0)' : 'translate3d(0, 0, 0) translateZ(0)',
    filter: props.blur ? 'blur(25px)' : undefined,
    ...(props.animation || {}),

    border: '1px black solid',
    borderRadius: 5,
    overflow: 'hidden',
    height: 100,
    cursor: 'pointer',
    ':hover': {
        opacity: 0.7
    }
  }));


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


export class ScenePicker extends React.Component<{ create?: boolean, selected?: string, animated?: boolean, blur?: boolean, onclick?: (id: string) => void }, {
    scenes: { [id: string]: { id: string, polygons: Polygon[], animations: Animation[] } }
}>{

    constructor(props: any) {
        super(props);
        this.state = { scenes: JSON.parse(window.localStorage.getItem('scenes')) || {} }
    }

    new = () => {
        let id = 'scene_' + getUid();
        this.state.scenes[id] = { id: id, polygons: [polygonItem, polygonItem2], animations: [glow, move] };
        this.setState({
            scenes: this.state.scenes
        });
    }

    componentDidUpdate() {
        window.localStorage.setItem('scenes', JSON.stringify(this.state.scenes));
    }

    render() {
        return (
            <Vertical padding="20px" style={{ zIndex: 1, background: 'white' }}>
                {Object.keys(this.state.scenes).map(sKey =>
                    <StyledScene
                        onClick={() => this.props.onclick(sKey)}
                        blur={this.props.blur}
                        grid={false}
                        animation={this.props.animated ? animation(this.state.scenes[sKey].animations, this.state.scenes[sKey].polygons) : undefined}
                    >
                        {polygonsToSvg(this.state.scenes[sKey].polygons)}
                    </StyledScene>)}
                {this.props.create && <Button onClick={this.new}><i className="material-icons">add</i></Button>}
            </Vertical>
        );
    }
}