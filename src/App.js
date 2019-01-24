import React, { Component } from 'react';
import '@/less/App.less';
import {Menubar,MenubarLayout,MenubarItem,MenubarRightContainer} from "@/layouts/Menubar"
import Frame from "@/layouts/Frame"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex:this.getIndexByLocation(props),
      isOpen:true
    };
    this.onRequestClose=this.onRequestClose.bind(this)
  }
  onRequestClose(){
    this.setState({
      isOpen:false
    })
  }
  shouldComponentUpdate(nextProps, nextState) {
    //路由变化时阻止刷新，改变tab的state后刷新
    if(nextState.isOpen!==this.state.isOpen) {
      return true;
    }
    if(nextState.activeIndex!==this.state.activeIndex) {
      return true;
    }
    if(nextProps.location.pathname!==this.props.location.pathname){
      let toIndex=this.getIndexByLocation(nextProps);
      if(toIndex===this.state.activeIndex) return true;
      this.setState({
        activeIndex:toIndex
      })
    }
    return false
  }
  getIndexByLocation(props){
    let toIndex=-1;
    if(props.location.pathname.search("/guide")>-1){
      toIndex=0;
    }else if(props.location.pathname.search("/brushVotes/cookieType")>-1){
      toIndex=1;
    }else if(props.location.pathname.search("/brushVotes/wechatType")>-1){
      toIndex=2;
    }else if(props.location.pathname.search("/statistics")>-1){
      toIndex=3;
    }
    return toIndex
  }
  render() {
    return (
      <MenubarLayout>
        <Menubar>
          <MenubarItem
              to="/guide"
              icon={require('@/assets/icon_nav_guide.png')}
              active={this.state.activeIndex===0}>
          </MenubarItem>
          <MenubarItem
              to="/brushVotes/cookieType"
              icon={require('@/assets/icon_nav_vote_1.png')}
              active={this.state.activeIndex===1}>
          </MenubarItem>
          <MenubarItem
              to="/brushVotes/wechatType"
              icon={require('@/assets/icon_nav_vote_2.png')}
              active={this.state.activeIndex===2}>
          </MenubarItem>
          <MenubarItem
              to="/statistics"
              icon={require('@/assets/icon_nav_statistics.png')}
              active={this.state.activeIndex===3}>
          </MenubarItem>
        </Menubar>
        <MenubarRightContainer className="menubar-right-container-1">
          <Frame title="主页">
            {this.props.children}
          </Frame>
        </MenubarRightContainer>
      </MenubarLayout>
    );
  }
}

export default App;
