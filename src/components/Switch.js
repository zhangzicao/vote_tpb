import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Switch.less';

export default class Switch extends Component {
  constructor(props){
    super(props);
    this.onClick=this.onClick.bind(this)
  }
  onClick(e){
    this.props.onChange&&this.props.onChange(!this.props.checked,this.props.name);
  }
  render() {
    let switchClass = classnames({
      'switch': true,
      ['switch-'+(this.props.checked?"checked":"unchecked")]:true,
    })+" "+(this.props.className||"");
    let { name, checked, checkedChildren, unCheckedChildren, onChange, ...switchProps}=this.props;
    return <button
        {...switchProps}
        className={switchClass}
        type="button"
        role="switch"
        aria-checked={String(this.props.checked)}
        onClick={this.onClick}
      >
      <span className="switch-inner">
        { this.props.checked ?
            this.props.checkedChildren :
            this.props.unCheckedChildren
        }
      </span>
    </button>;
  }
}

Switch.propTypes={
  name:PropTypes.string,
  checked:PropTypes.bool,
  disabled:PropTypes.bool,
  checkedChildren:PropTypes.node,
  unCheckedChildren:PropTypes.node,
  onChange:PropTypes.func
}

Switch.defaultProps={
  checked:false,
  checkedChildren:'',
  unCheckedChildren:'',
}
