require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

imageDatas = (function (imageDatasArr) {
  for(var i = 0; i < imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageUrl = '../images/' + imageDatasArr[i].fileName;
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class GalleryByReactAppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="image-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}


GalleryByReactAppComponent.defaultProps = {
};

export default GalleryByReactAppComponent;
