/**
 * Created by Aaron on 2017/2/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';

class ControllerUnit extends React.Component{
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
    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    var spanClassName = "controller-unit";
    spanClassName += this.props.arrange.isCenter ? " is-center " : "";
    spanClassName += this.props.arrange.isInverse ? " is-inverse " : "";
    return(
      <span className={spanClassName} onClick={this.handleClick}></span>
    );
  }

}

export default ControllerUnit;
