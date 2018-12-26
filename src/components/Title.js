import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Title.less';

export default class Title extends Component {
  render() {
    let {text, subText, ...titleProps}=this.props;
    return (
        <div {...titleProps} className={(this.props.className||"")+" main-title"}>
          {this.props.text}
          {this.props.subText}
          {this.props.children}
          </div>
    );
  }
}
Title.propTypes={
  text:PropTypes.node,
  subText:PropTypes.node
}