import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Button.less';
import {Link} from "react-router-dom";

class Button extends Component {
  render() {
    let btnClass = classnames({
      'btn': true,
      ['btn-'+this.props.color]:true,
      'btn_disabled':this.props.disabled,
      'btn_round':this.props.round,
    })+" "+(this.props.className||"");
    let Wrap="button";
    if(this.props.to){
      Wrap=Link;
    }
    return (
        <Wrap to={this.props.to} type={this.props.type} className={btnClass}>{this.props.children}</Wrap>
    );
  }
}

Button.propTypes={
  color:PropTypes.string,
  type:PropTypes.string,
  disabled:PropTypes.bool,
  round:PropTypes.bool
}

Button.defaultProps={
  color:"primary",
  type:"submit",
  disabled:false,
  round:false
}

export default Button;
