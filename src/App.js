import React, { Component } from 'react';
import '@/less/App.less';
import {Menubar,MenubarLayout,MenubarItem,MenubarRightContainer} from "@/layouts/Menubar"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex:this.getIndexByLocation(props)
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    //路由变化时阻止刷新，改变tab的state后刷新
    if(nextState.activeIndex!==this.state.activeIndex) {
      return true;
    }
    if(nextProps.location.pathname!==this.props.location.pathname){
      let toIndex=this.getIndexByLocation(nextProps);
      this.setState({
        activeIndex:toIndex
      })
    }
    return false
  }
  getIndexByLocation(props){
    let toIndex=-1;
    if(props.location.pathname==="/index/guide"){
      toIndex=0;
    }else if(props.location.pathname==="/index/brushVotes/cookieType"){
      toIndex=1;
    }else if(props.location.pathname==="/index/brushVotes/wechatType"){
      toIndex=2;
    }else if(props.location.pathname==="/index/statictics"){
      toIndex=3;
    }
    return toIndex
  }
  render() {
    return (
      <MenubarLayout>
        <Menubar>
          <MenubarItem
              to="/index/guide"
              icon={require('@/assets/icon_nav_guide.png')}
              active={this.state.activeIndex===0}>
          </MenubarItem>
          <MenubarItem
              to="/index/brushVotes/cookieType"
              icon={require('@/assets/icon_nav_vote_1.png')}
              active={this.state.activeIndex===1}>
          </MenubarItem>
          <MenubarItem
              to="/index/brushVotes/wechatType"
              icon={require('@/assets/icon_nav_vote_2.png')}
              active={this.state.activeIndex===2}>
          </MenubarItem>
          <MenubarItem
              to="/index/statictics"
              icon={require('@/assets/icon_nav_statictics.png')}
              active={this.state.activeIndex===3}>
          </MenubarItem>
          <MenubarItem
              to="/welcome"
              icon={require('@/assets/icon_nav_guide.png')}
              active={this.state.activeIndex===4}>
          </MenubarItem>
        </Menubar>
        <MenubarRightContainer>
          {this.props.children}
        </MenubarRightContainer>
      </MenubarLayout>
    );
  }
}

export default App;
