import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Menubar.less';

// 主布局框架
export class MenubarLayout extends Component {
  render() {
    let componentClass = "menubar-layout "+(this.props.className||"");
    return (
        <div className={componentClass}>{this.props.children}</div>
    );
  }
}

//左侧菜单条
export class Menubar extends Component {
  render() {
    let styles={};
    if(this.props.bg){
      styles["backgroundColor"]=this.props.bg
    }
    if(!isNaN(parseInt(this.props.width))){
      styles["width"]=parseInt(this.props.width)+"px"
    }
    let componentClass = "menubar "+(this.props.className||"");
    return (
        <div className={componentClass} style={styles}>{this.props.children}</div>
    );
  }
}
Menubar.propTypes={
  bg:PropTypes.string,
  width:PropTypes.oneOfType([PropTypes.number,PropTypes.string])
}


//右侧主容器
export class MenubarRightContainer extends Component {
  render() {
    let styles="";
    if(this.props.bg){
      styles+="background-color:"+this.props.bg+";"
    }
    let componentClass = "menubar-right-container "+(this.props.className||"");
    return (
        <div className={componentClass} styles={styles}>{this.props.children}</div>
    );
  }
}
MenubarRightContainer.propTypes={
  bg:PropTypes.string
}


//菜单项
export class MenubarItem extends Component {
  render() {
    let itemClass=classnames({
      'menubar-item':true,
      'menubar-item-active':!!this.props.active
    })+" "+(this.props.className||"");
    let iconClass=classnames({
      'menubar-item-icon':true,
      'menubar-item-icon-no-active':!this.props.active&&!this.props.activeIcon,
      'menubar-item-icon-active':!!this.props.active
    })
    let iconSrc=!!this.props.active?(this.props.activeIcon||this.props.icon):this.props.icon;
    let Wrap="div";
    if(this.props.to){
      Wrap=Link;
    }
    return (
        <Wrap to={this.props.to} className={itemClass} onClick={ this.props.onClick }>
          <img className={iconClass} src={iconSrc} alt={this.props.title} title={this.props.title}/>
        </Wrap>
    );
  }
}

MenubarItem.propTypes={
  icon:PropTypes.string.isRequired,
  activeIcon:PropTypes.string,
  active:PropTypes.bool,
  onClick:PropTypes.func,
  title:PropTypes.string
}
