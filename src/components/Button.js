import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Button.less';
import {Link} from "react-router-dom";

export default class Button extends Component {
  render() {
    let btnClass = classnames({
      'btn': true,
      ['btn-'+this.props.color]:true,
      'btn_disabled':this.props.disabled,
      'btn_round':this.props.round,
      'btn_block':this.props.block,
      ['size-'+this.props.size]:!!this.props.size,
    })+" "+(this.props.className||"");
    let Wrap="button";
    if(this.props.to){
      Wrap=Link;
    }
    let {className, color, round, block, size, ...btnProps}=this.props;
    return (
        <Wrap {...btnProps} className={btnClass}>{this.props.children}</Wrap>
    );
  }
}

Button.propTypes={
  color:PropTypes.string,
  type:PropTypes.string,
  disabled:PropTypes.bool,
  round:PropTypes.bool,
  block:PropTypes.bool,
  size:PropTypes.oneOf(["l","ll","s","xs","mini"])
}

Button.defaultProps={
  color:"primary",
  type:"submit",
  disabled:false,
  round:false,
  block:false
}

//按钮条
export class ButtonBar extends Component {
  render() {
    return (
        <div style={{'textAlign':this.props.align}} className="btns-bar">{this.props.children}</div>
    );
  }
}

ButtonBar.propTypes={
  align:PropTypes.oneOf(["center","left","right"])
}

ButtonBar.defaultProps={
  align:"center"
}