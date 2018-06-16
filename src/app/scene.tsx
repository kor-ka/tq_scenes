import * as React from 'react';
import * as glamor from 'glamor';
import Glamorous from 'glamorous';

const flameLeft = glamor.keyframes({
    '0%': {
      opacity: 0,
      transform: 'translate3d(0, 0, 1px)',
    },
    '70%': {
      opacity: 1,
      transform: 'translate3d(0.9%, -0.1%, 1px)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate3d(0.7%, -2.8%, 1px)',
  
    }
  });
  
  const flameRight = glamor.keyframes({
    '0%': {
      opacity: 0,
      transform: 'translate3d(-0.1%, 0.1%, 2px)',
    },
    '60%': {
      opacity: 1,
      transform: 'translate3d(-0.9%, -0.2%, 2px)',
    },
    '100%': {
      opacity: 0,
      transform: 'translate3d(-0.7%, -3.9%, 2px)',
  
    }
  });
  
  const glow = glamor.keyframes({
    '0%': {
      opacity: 0.5,
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.5,
  
    }
  });
  
  
  const animation = {
    '& #flame1, & #flame4': {
      animation: `${flameLeft} 2.4s infinite `
    },
  
    '& #flame2, & #flame3': {
      animation: `${flameRight} 2.2s infinite `
    },
  
    '& #flame_base1, & #flame_base2': {
      animation: `${glow} 5s infinite `
    },
  
    '& #flame_base3': {
      animation: `${glow} 4.2s infinite `
    },
  };
  
  const blur = {
    filter: 'blur(25px)'
  };
  
  const svgDAy = <svg height="100%" width="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1556 1571" >
    <g id="Page-1">
      <rect id="Rectangle" fill="#B9D2E7" x="1" y="0" width="1555" height="788"></rect>
      <polygon id="Path-11" fill="#0365B7" points="0.971892547 692 1555.97189 745.564347 1555.97189 1480 8.92354571 1480"></polygon>
      <polygon id="Path-8" fill="#143F68" points="973.24465 692 622 866.046529 1555.24399 1208.35692 1555.24399 782.471567"></polygon>
      <polygon id="Path-9" fill="#73B3DD" points="445 872 709.759114 822.519235 787 872"></polygon>
      <polygon id="Path-3" fill="#2B3030" points="1 1306.72296 1 834 1556 921.1673 1556 1306.72296"></polygon>
      <polygon id="Path-6" fill="#373830" opacity="0.9328125" points="1555.62169 1166.85869 1186 1022.32728 1404.80396 378.254056 1555.62169 236"></polygon>
      <polygon id="Path-2" fill="#3C463C" points="0.760683685 917 1555.76068 1028.32252 1555.76068 1571 0.760683685 1571"></polygon>
      <polygon id="Path-13" fill="#573941" transform="translate(990.868033, 1078.622443) rotate(9.000000) translate(-990.868033, -1078.622443) " points="1065.56794 1026.92154 1065.56794 1130.32334 916.168123 1130.32334 916.168123 1026.92154"></polygon>
      <polygon id="flame_base2" fill-opacity="0.706776495" fill="#573941" opacity="0.767633929" transform="translate(984.538885, 1104.788972) rotate(7.000000) translate(-984.538885, -1104.788972) " points="1126.57207 1068.25638 1093.16786 1162.63649 842.505702 1166.85869 879.06399 1042.71926"></polygon>
      <polygon id="flame_base1" fill="#FF6D01" transform="translate(990.513980, 1067.313793) rotate(13.000000) translate(-990.513980, -1067.313793) " points="1052.99832 1028.94495 1052.99832 1105.68264 928.029642 1105.68264 928.029642 1028.94495"></polygon>
      <polygon id="Path-15" fill="#FAC504" transform="translate(994.037494, 1030.677691) rotate(12.000000) translate(-994.037494, -1030.677691) " points="1044.48206 1082.11906 1044.48206 979.236322 943.592927 979.236322 943.592927 1082.11906"></polygon>
      <polygon id="Path-15" fill="#FAC504" transform="translate(994.212957, 983.328238) rotate(12.000000) translate(-994.212957, -983.328238) " points="1014.30342 1024.50686 1014.30342 942.149615 974.122492 942.149615 974.122492 1024.50686"></polygon>
      <polygon id="flame1" fill-opacity="0.687641531" fill="#FFA400" transform="translate(1038.883803, 989.107187) rotate(29.000000) translate(-1038.883803, -989.107187) " points="1056.31098 973.345024 1021.45662 973.345024 1021.45662 1004.86935 1056.31098 1004.86935"></polygon>
      <polygon id="flame2" fill-opacity="0.687641531" fill="#FFA400" transform="translate(1041.274105, 1012.041070) rotate(17.000000) translate(-1041.274105, -1012.041070) " points="1058.70129 996.278907 1023.84693 996.278907 1023.84693 1027.80323 1058.70129 1027.80323"></polygon>
      <polygon id="flame3" fill-opacity="0.687641531" fill="#FFA400" transform="translate(959.912911, 983.607990) rotate(15.000000) translate(-959.912911, -983.607990) " points="977.340091 967.845828 942.485731 967.845828 942.485731 999.370153 977.340091 999.370153"></polygon>
      <polygon id="flame4" fill-opacity="0.687641531" fill="#FFA400" transform="translate(980.683603, 939.828388) rotate(27.000000) translate(-980.683603, -939.828388) " points="998.110783 924.066225 963.256423 924.066225 963.256423 955.590551 998.110783 955.590551"></polygon>
    </g>
  </svg>;
  
  const svgNight = <svg height="100%" width="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1556 1571" >
    <g id="Page-1" >
      <rect id="Rectangle" fill="#062138" x="0" y="0" width="1555" height="788"></rect>
      <polygon id="Path-11" fill="#01192D" points="0 692 1555 745.564347 1555 1480 7.95165316 1480"></polygon>
      <polygon id="Path-8" fill="#061422" points="972.24465 692 621 866.046529 1554.24399 1208.35692 1554.24399 782.471567"></polygon>
      <polygon id="Path-9" fill="#000000" points="444 871.480765 708.759114 822 786 871.480765"></polygon>
      <polygon id="Path-3" fill="#141717" points="2.54649402e-13 1306.72296 0 834 1555 921.1673 1555 1306.72296"></polygon>
      <polygon id="Path-6" fill="#171814" opacity="0.9328125" points="1554.62169 1166.85869 1185 1022.32728 1403.80396 378.254056 1554.62169 236"></polygon>
      <polygon id="Path-2" fill="#1C211C" points="0 917 1555 1028.32252 1555 1571 2.56066145e-13 1571"></polygon>
      <polygon id="Path-13" fill="#573941" transform="translate(989.868033, 1078.750019) rotate(9.000000) translate(-989.868033, -1078.750019) " points="1064.56794 1027.04912 1064.56794 1130.45092 915.168123 1130.45092 915.168123 1027.04912"></polygon>
      <polygon id="flame_base2" fill-opacity="0.706776495" fill="#834556" opacity="0.767633929" transform="translate(864.309863, 1118.487625) rotate(7.000000) translate(-864.309863, -1118.487625) " points="1012.22772 1090.74704 961.53044 1147.16234 716.392011 1142.56242 775.784073 1089.81291"></polygon>
      <polygon id="flame_base2" fill-opacity="0.706776495" fill="#834556" opacity="0.767633929" transform="translate(979.808842, 1159.337499) rotate(7.000000) translate(-979.808842, -1159.337499) " points="1010.87675 1104.62466 1086.74697 1200.60482 872.870717 1214.05034 960.600488 1110.79781"></polygon>
      <polygon id="flame_base3" fill-opacity="0.706776495" fill="#834556" opacity="0.767633929" transform="translate(979.547048, 1092.357651) rotate(7.000000) translate(-979.547048, -1092.357651) " points="1154.9662 1064.1681 945.332268 1120.5472 804.127895 1101.82092 904.927624 1067.08134"></polygon>
      <polygon id="flame_base3" fill-opacity="0.706776495" fill="#834556" opacity="0.767633929" transform="translate(885.960322, 1159.721130) rotate(7.000000) translate(-885.960322, -1159.721130) " points="988.500429 1117.1794 939.176205 1168.46483 783.420215 1202.26286 875.784028 1131.01923"></polygon>
      <polygon id="flame_base3" fill-opacity="0.706776495" fill="#834556" opacity="0.767633929" transform="translate(1060.446792, 1121.658308) rotate(7.000000) translate(-1060.446792, -1121.658308) " points="1103.60065 1096.91793 1208.98568 1140.31881 911.907908 1146.39869 1033.76606 1099.70934"></polygon>
      <polygon id="flame_base2" fill-opacity="0.400079257" fill="#834556" opacity="0.767633929" transform="translate(1257.094037, 817.505918) rotate(7.000000) translate(-1257.094037, -817.505918) " points="1285.29129 668.712241 1249.53949 849.966578 1228.89678 966.299594 1244.03312 805.120787"></polygon>
      <polygon id="flame_base2" fill-opacity="0.706776495" fill="#834556" opacity="0.767633929" transform="translate(1087.580664, 1171.656042) rotate(7.000000) translate(-1087.580664, -1171.656042) " points="1114.24265 1141.59128 1197.2779 1210.23089 1012.08841 1183.45154 977.883424 1133.0812"></polygon>
      <polygon id="flame_base1" fill="#FF4D00" transform="translate(989.513980, 1067.441369) rotate(13.000000) translate(-989.513980, -1067.441369) " points="1051.99832 1029.07253 1051.99832 1105.81021 927.029642 1105.81021 927.029642 1029.07253"></polygon>
      <polygon id="Path-15" fill="#FAB604" transform="translate(993.037494, 1030.805267) rotate(12.000000) translate(-993.037494, -1030.805267) " points="1043.48206 1082.24664 1043.48206 979.363898 942.592927 979.363898 942.592927 1082.24664"></polygon>
      <polygon id="Path-15" fill="#FAC504" transform="translate(993.212957, 983.455814) rotate(12.000000) translate(-993.212957, -983.455814) " points="1013.30342 1024.63444 1013.30342 942.277191 973.122492 942.277191 973.122492 1024.63444"></polygon>
      <polygon id="flame1" fill-opacity="0.687641531" fill="#FFA400" transform="translate(1037.883803, 989.234763) rotate(29.000000) translate(-1037.883803, -989.234763) " points="1055.31098 973.4726 1020.45662 973.4726 1020.45662 1004.99693 1055.31098 1004.99693"></polygon>
      <polygon id="flame2" fill-opacity="0.687641531" fill="#FFA400" transform="translate(1040.274105, 1012.168645) rotate(17.000000) translate(-1040.274105, -1012.168645) " points="1057.70129 996.406483 1022.84693 996.406483 1022.84693 1027.93081 1057.70129 1027.93081"></polygon>
      <polygon id="flame3" fill-opacity="0.687641531" fill="#FFA400" transform="translate(958.912911, 983.735566) rotate(15.000000) translate(-958.912911, -983.735566) " points="976.340091 967.973403 941.485731 967.973403 941.485731 999.497729 976.340091 999.497729"></polygon>
      <polygon id="flame4" fill-opacity="0.687641531" fill="#FFA400" transform="translate(979.683603, 939.955964) rotate(27.000000) translate(-979.683603, -939.955964) " points="997.110783 924.193801 962.256423 924.193801 962.256423 955.718127 997.110783 955.718127"></polygon>
      <polygon id="flame4" fill-opacity="0.861101676" fill="#FFA400" transform="translate(1016.105667, 924.978059) rotate(27.000000) translate(-1016.105667, -924.978059) " points="1016.10567 917.096977 998.678487 932.85914 1033.53285 932.85914"></polygon>
      <polygon id="flame4" fill-opacity="0.861101676" fill="#FFA400" transform="translate(985.890258, 940.322244) rotate(27.000000) translate(-985.890258, -940.322244) " points="981.711589 929.715844 976.827414 950.928643 994.953102 941.693144"></polygon>
      <polygon id="flame4" fill-opacity="0.861101676" fill="#FFA400" transform="translate(1011.173080, 959.234339) rotate(27.000000) translate(-1011.173080, -959.234339) " points="1019.88667 946.576237 1002.45949 962.338399 1015.22864 971.892441"></polygon>
    </g>
  </svg>;
  
  const StyledScene = Glamorous.div<{ blur: boolean, animate: boolean }>((props) => ({
    transform: 'scale(1.2) translate3d(0, 0, 0) translateZ(0)',
    ...(props.animate ? animation : {}),
    ...(props.blur ? blur : {}),
  }));
  
  class Scene extends React.Component<{ blur: boolean, scene: JSX.Element, animate: boolean }> {
    render() {
      return (
        <StyledScene blur={this.props.blur} animate={this.props.animate}>
          {this.props.scene}
        </StyledScene>
      );
    }
  }
  
  const Root = Glamorous.div({
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  });
  
  export class SceneComponent extends React.Component<{}, { iterate: number }> {
    constructor(props: { time: 'day' | 'night' }) {
      super(props);
      this.state = { iterate: 0 };
    }
  
    render() {
      return (
        <Root onClick={() => { this.setState({ iterate: this.state.iterate + 1 }) }}>
          <Scene scene={this.state.iterate % 2 === 0 ? svgDAy : svgNight} blur={this.state.iterate % 4 < 2} animate={this.state.iterate % 8 < 4} />
        </Root>
      );
    }
  }
  