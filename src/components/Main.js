require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

imageDatas = ((imageDatasArr) => {
  for(var i = 0; i < imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = '../images/' + imageDatasArr[i].fileName;
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component{
  render(){
    return(
      <figure className="img-figure">
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryByReactAppComponent extends React.Component {
  render() {
    var imgFigures = [];
    var controllerUnits = [];
    for(var i = 0; i < imageDatas.length; i++){
      imgFigures.push(<ImgFigure data={imageDatas[i]}/>);
    }
    /*imageDatas.forEach((value) => {
      imgFigures.push(<ImgFigure data={value}/>);
    }*/

    return (
      <section className="stage">
        <section className="image-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}


GalleryByReactAppComponent.defaultProps = {
};

export default GalleryByReactAppComponent;
