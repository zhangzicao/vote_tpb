import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './LogBox.less';
import {dateFormat} from '../scripts/common';

export default class LogBox extends React.PureComponent {
  constructor(props){
    super(props);
    this.scrollToBottom=this.scrollToBottom.bind(this);
    this.clearAll=this.clearAll.bind(this);

    this.setRef = element => {
      this.content = element;
    };
  }
  getSnapshotBeforeUpdate(prevProps, prevState){
    //最新的渲染输出提交给DOM前将会立即调用，常用于保存快照（让你的组件能在当前的值可能要改变前获得它们）
    if(this.content.scrollTop>=this.content.scrollHeight-this.content.clientHeight)
      return true
    return null
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      this.scrollToBottom ()
    }
  }
  scrollToBottom (){
    // 滚动到底部
    if (this.content)
      this.content.scrollTo(0,this.content.scrollHeight);
  }
  clearAll (){
    // 清空
    this.props.onClearAll()
  }
  render() {
    let {logData, maxLine, height, onClearAll, ...otherProps}=this.props;
    return <div {...otherProps} className={"log-box "+(this.props.className||"")} style={{'height':this.props.height}}>
      <div className="log-box-bar">
        <button type="button" className="log-box-btn" onClick={this.clearAll}>
          <img src={require('@/assets/icon_del.png')} width="14"/>
        </button>
        <button type="button" className="log-box-btn" onClick={this.scrollToBottom}>
          <img src={require('@/assets/icon_tobottom.png')} width="14"/>
        </button>
      </div>
      <div className="log-box-content" ref={this.setRef}>
        {
          this.props.logData.map((logItem,index)=>{
            return <div className="log-box-line" key={index}><span className="log-box-line-pre">[{logItem.logTime}]</span>{logItem.message}</div>
          })
        }
      </div>
    </div>;
  }
}

LogBox.propTypes={
  logData:PropTypes.array.isRequired,
  onClearAll:PropTypes.func.isRequired,
  maxLine:PropTypes.number,
  height:PropTypes.string
}

LogBox.defaultProps={
  logData:[],
  maxLine:150,
  height:"300px"
}
