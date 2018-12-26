import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Select.less';

export default class Select extends Component {
  constructor(props){
    super(props);
    this.onChange=this.onChange.bind(this);

    if(this.props.autoFocus){
      this.textSelect = null;

      this.setTextSelectRef = element => {
        this.textSelect = element;
      };

      this.focusTextSelect = () => {
        // 直接使用原生 API 使 text 输入框获得焦点
        if (this.textSelect) this.textSelect.focus();
      };
    }
  }
  componentDidMount(){
    if(this.props.autoFocus){
      // 渲染后文本框自动获得焦点
      this.focusTextSelect();
    }
  }
  onChange(e){
    typeof this.props.onChange === 'function' && this.props.onChange(e);
  }
  render() {
    let selectClass = classnames({
      'select': true,
      'select_disabled':this.props.disabled,
      ['size-'+this.props.size]:!!this.props.size,
    })+" "+(this.props.className||"");
    let { className, width, size, onChange, autoFocus, ...selectProps}=this.props;
    return <div className="select-wrap">
      <select
          {...selectProps}
          className={selectClass}
          onChange={this.onChange}
          ref={this.setTextSelectRef}
      >
        {this.props.children}
      </select>
      <span className="select-bottom-line"></span>
    </div>;
  }
}

Select.propTypes={
  disabled:PropTypes.bool,
  size:PropTypes.oneOf(["l","ll","s","xs","mini"]),
  width:PropTypes.string,
  autoFocus:PropTypes.bool,
  onChange:PropTypes.func,
}