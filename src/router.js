import React from 'react';
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";
import App from '@/App';
import Welcome from "@/pages/Welcome"
import Guide from "@/pages/Guide"
import BrushVotesCookieType from "@/pages/BrushVotesCookieType"
import VoteCookieType from "@/pages/VoteCookieType"
import Statictics from "@/pages/Statictics"

export default function () {
  return <HashRouter>
    <Switch>
      <Route path="/welcome" component={Welcome}></Route>
      <Route path="/index" children={props=>(
          <App {...props}>
            <Switch>
            <Route path="/index/guide" component={Guide}></Route>
            <Route path="/index/brushVotes/cookieType" children={props=>(
                <BrushVotesCookieType {...props}>
                  <Switch>
                    <Route path="/index/brushVotes/cookieType/:id" component={VoteCookieType}></Route>
                    <Redirect to="/index/brushVotes/cookieType/1" />
                  </Switch>
                </BrushVotesCookieType>
            )}></Route>
            <Route path="/index/brushVotes/wechatType" component={BrushVotesCookieType}></Route>
            <Route path="/index/statictics" component={Statictics}></Route>
            <Redirect to="/index/guide" />
            </Switch>
          </App>
      )}>
      </Route>
      <Redirect to="/welcome" />
    </Switch>
  </HashRouter>
}