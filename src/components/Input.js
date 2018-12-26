import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Input.less';

export default class Input extends Component {
  constructor(props){
    super(props);
    this.onChange=this.onChange.bind(this);

    if(this.props.autoFocus){
      this.textInput = null;

      this.setTextInputRef = element => {
        this.textInput = element;
      };

      this.focusTextInput = () => {
        // 直接使用原生 API 使 text 输入框获得焦点
        if (this.textInput) this.textInput.focus();
      };
    }
  }
  componentDidMount(){
    if(this.props.autoFocus){
      // 渲染后文本框自动获得焦点
      this.focusTextInput();
    }
  }
  onChange(e){
    if(this.props.type==='number'&&e.target.value!==""){
      //最小最大值
      if(this.props.min && this.props.min>e.target.value){
        e.target.value=this.props.min
      }
      if(this.props.max && this.props.max<e.target.value){
        e.target.value=this.props.max
      }
    }
    if(!isNaN(Number(e.target.value))&&this.props.toInt){
      e.target.value=parseInt(e.target.value)
    }
    typeof this.props.onChange === 'function' && this.props.onChange(e);
  }
  render() {
    let iptClass = classnames({
      'input': true,
      'input_disabled':this.props.disabled,
      'input_readonly':this.props.readOnly,
      ['size-'+this.props.size]:!!this.props.size,
      ['text-'+this.props.align.substring(0,1)]:true,
    })+" "+(this.props.className||"");
    let { align, className, width, size, min, max, onChange, autoFocus, toInt, ...inputProps}=this.props;
    return <div className="input-wrap">
      <input
          {...inputProps}
          className={iptClass}
          onChange={this.onChange}
          ref={this.setTextInputRef}
      />
      <span className="input-bottom-line"></span>
    </div>;
  }
}

Input.propTypes={
  type:PropTypes.string,
  disabled:PropTypes.bool,
  readOnly:PropTypes.bool,
  size:PropTypes.oneOf(["l","ll","s","xs","mini"]),
  width:PropTypes.string,
  align:PropTypes.oneOf(["center","left","right"]),
  min:PropTypes.number,
  max:PropTypes.number,
  toInt:PropTypes.bool,//是否将小数转为整数
  autoFocus:PropTypes.bool,
  onChange:PropTypes.func,
}

Input.defaultProps={
  type:"text",
  align:"left"
}
