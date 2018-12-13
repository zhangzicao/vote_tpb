import React, { Component } from 'react';
import { HashRouter,Route,Link } from 'react-router-dom';
import '@/less/App.less';
import {Menubar,MenubarLayout,MenubarItem,MenubarRightContainer} from "@/layouts/Menubar"
//路由
import home from "@/pages/home"
import statictics from "@/pages/statictics"

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex:0
    };
  }
  tabTo(index){
    this.setState(function (prevState, props) {
      return {
        activeIndex:index
       };
    })
  }
  render() {
    return (
      <HashRouter>
      <MenubarLayout>
        <Menubar>
          <Link to="/">
            <MenubarItem
                icon={require('@/assets/icon_nav_home.png')}
                active={this.state.activeIndex==0}
                tabTo={()=>{ this.tabTo(0) }}>
            </MenubarItem>
          </Link>
          <Link to="/statictics">
            <MenubarItem
                icon={require('@/assets/icon_nav_home.png')}
                active={this.state.activeIndex==1}
                tabTo={()=>{ this.tabTo(1) }}>
            </MenubarItem>
          </Link>
        </Menubar>
        <MenubarRightContainer>
            <Route path="/" exact component={home}></Route>
            <Route path="/statictics" component={statictics}></Route>
        </MenubarRightContainer>
      </MenubarLayout>
      </HashRouter>
    );
  }
}

export default App;
