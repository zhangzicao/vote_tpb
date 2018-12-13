import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Menubar.less';

export class MenubarLayout extends Component {
  render() {
    return (
        <div className="menubar-layout">{this.props.children}</div>
    );
  }
}

export class Menubar extends Component {
  render() {
    let styles={};
    if(this.props.bg){
      styles["backgroundColor"]=this.props.bg
    }
    if(!isNaN(parseInt(this.props.width))){
      styles["width"]=parseInt(this.props.width)+"px"
    }
    return (
        <div className="menubar" style={styles}>{this.props.children}</div>
    );
  }
}
Menubar.propTypes={
  bg:PropTypes.string,
  width:PropTypes.oneOfType([PropTypes.number,PropTypes.string])
}

export class MenubarRightContainer extends Component {
  render() {
    let styles="";
    if(this.props.bg){
      styles+="background-color:"+this.props.bg+";"
    }
    return (
        <div className="menubar-right-container">{this.props.children}</div>
    );
  }
}
MenubarRightContainer.propTypes={
  bg:PropTypes.string
}

export class MenubarItem extends Component {
  render() {
    let itemClass=classnames({
      'menubar-item':true,
      'menubar-item-active':!!this.props.active
    })
    let iconClass=classnames({
      'menubar-item-icon':true,
      'menubar-item-icon-no-active':!this.props.active&&!this.props.activeIcon,
      'menubar-item-icon-active':!!this.props.active
    })
    let iconSrc=!!this.props.active?(this.props.activeIcon||this.props.icon):this.props.icon;
    return (
        <div className={itemClass} onClick={ this.props.tabTo }>
          <img className={iconClass} src={iconSrc} />
        </div>
    );
  }
}

MenubarItem.propTypes={
  icon:PropTypes.string.isRequired,
  activeIcon:PropTypes.string,
  active:PropTypes.bool,
  tabTo:PropTypes.func
}
