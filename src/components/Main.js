require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

var imageDatas = require('../data/imageDatas.json');

imageDatas = ((imageDatasArr) => {
  for(var i = 0; i < imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = '../images/' + imageDatasArr[i].fileName;
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
var getRangeRandom = (low, high) => Math.ceil(Math.random() * (high - low) + low);

//获取0-30°之间一个任意正负值
var get30DegRandom = () => {
  var deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.stopPropagation();//停止冒泡
    e.preventDefault();
  }

  render(){
    var styleObj = {};
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度不为0 ，旋转
    if(this.props.arrange.rotate) {
      let rotate = this.props.arrange.rotate;
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
        styleObj[value] = 'rotate(' + rotate + 'deg)';
      });
    }

    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? " is-inverse " : "";

    //设置中心图片的zIndex,使其不被其他遮住
    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
            <p>
              {this.props.data.fileName}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class GalleryByReactAppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        top: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {  //垂直方向的取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        /*{
          pos:{
            left: '0',
            top:  '0'
          },
          rotate: 0, //旋转角度
          isInverse: false, //图片正反面
          isCenter: false //是否居中
        }*/
      ]
    }
  }

  inverse(index){
    return() =>{
        var imgsArrangeArr = this.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !this.state.imgsArrangeArr[index].isInverse;
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
    }
  }

  center(index){
    return() =>{
      this.reArrange(index);
    }
  }

  componentDidMount(){
    //首先拿到舞台的大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage);
    var stageWidth = stageDom.scrollWidth;
    var stageHeight = stageDom.scrollHeight;
    //alert("stageWidth:" + stageWidth + ", stageHeight:" + stageHeight);
    var halfStageWidth = Math.ceil(stageWidth / 2);
    var halfStageHeight = Math.ceil(stageHeight / 2);

    //拿到一个imgFigure的大小
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigures0);
    var imgFigureWidth = imgFigureDom.scrollWidth;
    var imgFigureHeight = imgFigureDom.scrollHeight;
    //alert("imgFigureWidth:" + imgFigureWidth + ", imgFigureHeight:" + imgFigureHeight);
    var halfImgFigureWidth = Math.ceil(imgFigureWidth / 2);
    var halfImgFigureHeight = Math.ceil(imgFigureHeight / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
        left: halfStageWidth - halfImgFigureWidth,
        top: halfStageHeight - halfImgFigureHeight
      }

    //计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgFigureWidth;
    this.Constant.hPosRange.leftSecX[1] = halfStageWidth - halfImgFigureWidth * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageWidth + halfImgFigureWidth;
    this.Constant.hPosRange.rightSecX[1] = stageWidth - halfImgFigureWidth;
    this.Constant.hPosRange.y[0] = -halfImgFigureHeight;
    this.Constant.hPosRange.y[1] = stageHeight - halfImgFigureHeight;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgFigureWidth;
    this.Constant.vPosRange.topY[1] = halfStageHeight - halfImgFigureWidth * 3;
    this.Constant.vPosRange.x[0] = halfStageWidth - imgFigureWidth;
    this.Constant.vPosRange.x[1] = halfImgFigureWidth;
    //var startNum = Math.ceil(Math.random() * imageDatas.length);
    this.reArrange(0);
  }
  /*
   *重新布局所有图片
   * @param centerIndex 指定居中的图片
   */
  reArrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      topImgNum = Math.floor(Math.random() * 2),//取一个或者不取

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    //首先居中centerIndex图片 ,centerIndex图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    }
    //取出要布局上侧的图片的状态信息(先随意选一张图片作为顶部图片，然后取出来)
    var topImgSpiceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    let imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });
    //布局左两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }
    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  render() {
    var imgFigures = [];
    var controllerUnits = [];
    imageDatas.forEach((value, index) => {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure
        data = {value}
        ref = {"imgFigures" + index}
        arrange = {this.state.imgsArrangeArr[index]}
        center = {this.center(index)}
        inverse = {this.inverse(index)}
      />);
    });


    return (
      <section className="stage" ref="stage">
        <section className="image-sec">
          {imgFigures}
        </section>
        <ConrrollerNav className="controller-nav">
          {controllerUnits}
        </ConrrollerNav>
      </section>
    );
  }
}


GalleryByReactAppComponent.defaultProps = {
};

export default GalleryByReactAppComponent;
