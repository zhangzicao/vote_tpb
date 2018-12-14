import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './IconBox.less';

export class IconBoxContainer extends Component {
  render() {
    let componentClass='app-grid-list '+(this.props.className||"");
    return (
        <div className={componentClass}>{this.props.children}</div>
    );
  }
}

export class IconBox extends Component {
  render() {
    let itemClass = classnames({
      'app-grid-item': true,
      'app-grid-item_round':this.props.round,
      'app-grid-item_show-overlay':this.props.showOverlay,
    })+" "+(this.props.className||"");
    let Wrap="div";
    if(this.props.to){
       Wrap=Link
    }
    return (
        <Wrap to={this.props.to} className={itemClass}>
          <div className="app-grid-item-inner">
            <span className="app-grid-item__icon-wr"><img className="app-grid-item__icon" src={this.props.icon} alt={this.props.alt}/></span>
            {
              this.props.text?<div className="app-grid-item__text">{this.props.text}</div>:null
            }
            {
              this.props.desc?<div className="app-grid-item__desc">{this.props.desc}</div>:null
            }
            {this.props.children}
          </div>
        </Wrap>
    );
  }
}

IconBox.propTypes={
  icon:PropTypes.string.isRequired,
  text:PropTypes.string,
  desc:PropTypes.string,
  round:PropTypes.bool,
  showOverlay:PropTypes.bool
}

IconBox.defaultProps={
  round:true,
  showOverlay:true
}