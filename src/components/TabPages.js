import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './TabPages.less';

export class Tabs extends React.PureComponent {
  constructor(props){
    super(props);
    this.state={
      activeIndex:props.defaultActive
    };
    this.onClick=this.onClick.bind(this);
  }
  onClick(i,onclk,onTab){
    if(i!==this.state.activeIndex){
      this.setState((prevState)=>{
        return {
          activeIndex:i
        }
      })
    }
    typeof onclk==='function'&&onclk(i);
    typeof onTab==='function'&&onTab(i);
  }
  render() {
    return (
        <ul className={"tabs "+(this.props.className||'')}>
          {this.props.pages.map((item,i) =>{
            let itemClass = classnames({
              'tabs-item': true,
              'active':this.state.activeIndex===i
            });
            return <li className={itemClass} key={item.key||item.id||i} onClick={()=>{ this.onClick(i,item.onClick,this.props.onTab) }}>
              { typeof item.to==='string' ? <Link to={item.to}>{item.title||(i+1)}</Link> : (item.title||(i+1)) }
            </li>
          }
          )}
          {this.props.children}
        </ul>
    );
  }
}
Tabs.propTypes={
  pages:PropTypes.arrayOf(PropTypes.shape({
    id:PropTypes.string,
    key:PropTypes.string,
    to:PropTypes.string
  })).isRequired,
  defaultActive:PropTypes.number,
  onTab:PropTypes.func
}

export default class TabPages extends React.PureComponent {
  constructor(props){
    super(props);
    this.state={
      activeIndex:props.defaultActive
    };
    this.onTab=this.onTab.bind(this);
  }
  onTab(i){
    if(i!==this.state.activeIndex){
      this.props.onTab&&this.props.onTab(i)
      this.setState((prevState)=>{
        return {
          activeIndex:i
        }
      });
    }
  }
  render() {
    return (
        <div className={'tab-container '+(this.props.className||'')} style={{"height":this.props.height}}>
          <Tabs pages={this.props.pages} defaultActive={this.props.defaultActive} onTab={this.onTab}/>
          <div className="tab-panels">
            {this.props.pages.map((item,i) =>{
                var Page=item.page;
                if(Page){
                  let itemClass = classnames({
                    'tab-panel': true,
                    'current':this.state.activeIndex===i
                  });
                  return <div className={itemClass} key={item.key||item.id||i}>
                    <Page />
                  </div>
                }
                else
                  return null
                }
            )}
            {this.props.children}
          </div>
        </div>
    );
  }
}

TabPages.propTypes={
  pages:PropTypes.array.isRequired,
  defaultActive:PropTypes.number,
  height:PropTypes.string,
  onTab:PropTypes.func
}