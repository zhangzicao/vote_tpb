import React from 'react';
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";
import App from '@/App';
import Welcome from "@/pages/Welcome"
import Guide from "@/pages/Guide"
import BrushVotesCookieType from "@/pages/BrushVotesCookieType"
import VoteCookieType from "@/pages/VoteCookieType"
import VoteWechatType from "@/pages/VoteWechatType"
import StatisticsIndex from "@/pages/StatisticsIndex"
import StatisticsNum from "@/pages/StatisticsNum"
import StatisticsSuccessRate from "@/pages/StatisticsSuccessRate"
import StatisticsList from "@/pages/StatisticsList"

export default function () {
  return <HashRouter>
    <Switch>
      <Route path="/welcome" component={Welcome} ></Route>
      <Route path="/" children={props=>(
        <App {...props}>
          <Switch>
            <Route path="/guide" component={Guide}></Route>
            <Route path="/brushVotes/cookieType" children={props=>(
              <BrushVotesCookieType {...props}>
                <Switch>
                  <Route path="/brushVotes/cookieType/:id" component={VoteCookieType}></Route>
                  <Redirect to="/brushVotes/cookieType/1" />
                </Switch>
              </BrushVotesCookieType>
            )}></Route>
            <Route path="/brushVotes/wechatType"  component={VoteWechatType}></Route>
            <Route path="/statistics" children={props=>(
                <StatisticsIndex {...props}>
                  <Switch>
                    <Route path="/statistics/num" component={StatisticsNum}></Route>
                    <Route path="/statistics/successRate" component={StatisticsSuccessRate}></Route>
                    <Route path="/statistics/list" component={StatisticsList}></Route>
                    <Redirect to="/statistics/num" />
                  </Switch>
                </StatisticsIndex>
            )}></Route>
            <Redirect to="/guide" />
          </Switch>
        </App>
      )}>
      </Route>
      <Redirect to="/welcome" />
    </Switch>
  </HashRouter>
}