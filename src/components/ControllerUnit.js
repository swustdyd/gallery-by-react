/**
 * Created by Aaron on 2017/2/16.
 */
import React from 'react';

class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClcik = this.handleClcik.bind(this);
  }

  handleClcik(e){

    e.stopPropagation();
    e.preventDefault();
  }

  render(){

    return(
      <span className="controller-unit"></span>
    );
  }
}

export default ControllerUnit;
