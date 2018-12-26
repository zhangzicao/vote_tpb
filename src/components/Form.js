import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Form.less';

export class Form extends Component {
  render() {
    return (
        <form className={(this.props.className||"")+" form"}>
          {this.props.children}
        </form>
    );
  }
}


export class FormItem extends Component {
  render() {
    let pdArr=(this.props.horizontalPadding||"").split(' ');
    let leftPadding=pdArr[0]===""?null:pdArr[0]
    let rightPadding=pdArr.length!==2?leftPadding:pdArr[1]
    return (
        <div className={'form-item '+(this.props.className||'')} style={{'width':this.props.width,'paddingLeft':leftPadding,'paddingRight':rightPadding,'lineHeight':this.props.lineHeight}}>
          {
            this.props.labelText &&
                <label className="form-item-label" style={{'width':this.props.labelWidth}}>{this.props.labelText}</label>
          }
          {
            this.props.prefix &&
                <div className="form-item-prefix">{this.props.prefix}</div>
          }
          <div className="form-input-block">
            {this.props.children}
          </div>
          {
            this.props.suffix &&
            <div className="form-item-suffix">{this.props.suffix}</div>
          }
        </div>
    );
  }
}

FormItem.propTypes={
  labelWidth:PropTypes.string,
  labelText:PropTypes.string,
  prefix:PropTypes.node,
  suffix:PropTypes.node,
  width:PropTypes.string,
  horizontalPadding:PropTypes.string,
  lineHeight:PropTypes.string
}