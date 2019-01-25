import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {connect} from 'react-redux'
import './Frame.less';
import Win from '@/scripts/WinInterface';
import {winMaximize,winMinimize,winRestore,winCloseConfirm} from "@/stores/actions";

// 主布局框架
export class FrameLayout extends React.PureComponent {
  render() {
    let {className,children,...otherProps}=this.props;
    return (
        <div className={"frame-layout "+(className||"")} {...otherProps}>
          {children}
          </div>
    );
  }
}

class FrameHeaderComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.defaultBtns={
      min:{
        name:'min',
        title:'最小化',
        iconClass:'icon_frame_min',
        onClick:()=>{
          props.winMinimize()
        }
      },
      max:{
        name:'max',
        title:'最大化',
        iconClass:'icon_frame_max',
        onClick:()=>{
          props.winMaximize()
        }
      },
      restore:{
        name:'restore',
        title:'还原',
        iconClass:'icon_frame_restore',
        onClick:()=>{
          props.winRestore()
        }
      },
      close:{
        name:'close',
        title:'关闭',
        iconClass:'icon_frame_close',
        onClick:()=>{
          props.winCloseConfirm()
        }
      }
    }
  }

  render() {
    let {className,children,btns,title}=this.props;
    let btnArr=btns.concat([]);
    btns.forEach((item,i) => {
      if(item==='min'||item==='max'||item==='restore'||item==='close')
        btnArr[i]=this.defaultBtns[item]
    });

    return (
        <div className={"frame-header "+(className||"")}>
          <div className="frame-header-btns">
            {btnArr.map((item,i)=>{
              let sClass=classnames({
                'frame-header-btn':true,
                ['frame-header-btn_'+item.name]:!!item.name,
                'ui-hide':(item.name==='max' && !!this.props.isMaximized)||(item.name==='restore' && !this.props.isMaximized)
              })
              return (<div className={sClass} key={item.title||i} title={item.title} onClick={item.onClick}>
                <i className={"frame-header-btn-icon "+(item.iconClass||"")}></i>
              </div>)
            })}
          </div>
          {title
              ?<div className="frame-header-title">{title}</div>
              :null
          }
          {children}
          </div>
    );
  }
}
FrameHeaderComponent.propTypes={
  btns:PropTypes.arrayOf(
      PropTypes.oneOfType([
          PropTypes.oneOf(['min', 'max', 'restore', 'close']),
          PropTypes.shape({
            name:PropTypes.string,
            title:PropTypes.string.isRequired,
            iconClass:PropTypes.element.isRequired,
            onClick:PropTypes.func.isRequired
          })
      ])
  ),
  title:PropTypes.string
}
FrameHeaderComponent.defaultProps={
  btns:['close','restore','max','min']
}

const mapStateToProps = (state, ownProps) => {
  let { isMaximized }=state.win[Win.id];
  return { isMaximized }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    winMaximize: () => {
      dispatch(winMaximize(Win));
    },
    winMinimize: () => {
      dispatch(winMinimize(Win));
    },
    winRestore: () => {
      dispatch(winRestore(Win));
    },
    winCloseConfirm: () => {
      dispatch(winCloseConfirm(Win));
    }
  }
}
export const FrameHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(FrameHeaderComponent)


export class FrameBody extends React.PureComponent {
  render() {
    let {className,children,...otherProps}=this.props;
    return (
        <div className={"frame-body "+(className||"")} {...otherProps}>
          <div className="frame-body-inner">{children}</div>
          </div>
    );
  }
}

export default class Frame extends React.PureComponent {
  render() {
    let {className,children,btns,title}=this.props;
    return (
        <FrameLayout className={className}>
          <FrameHeader btns={btns} title={title}></FrameHeader>
          <FrameBody>{children}</FrameBody>
        </FrameLayout>
    );
  }
}