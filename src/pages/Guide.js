import React  from 'react';
import "@/less/pages/Guide.less"
import {IconBoxContainer,IconBox} from "@/components/IconBox"

class Guide extends React.PureComponent {
  render() {
    return (
        <div className="guide-content">
          <div className="guide-content-inner">
            <div className="logo-wrap"><img src={require('@/assets/logo.png')} alt="刷投票吧" /></div>
            <div className="app-desc">用于投票吧vote8的刷投票的HTML5桌面应用</div>
            <div className="app-desc-secondary">基于electron+react开发</div>
            <IconBoxContainer className="app-grid-list-1">
              <IconBox to="/brushVotes/cookieType" icon={require('@/assets/grid_icon_vote1.png')} text="免费建站类刷票" desc="（适用cookie限制类）"></IconBox>
              <IconBox to="/brushVotes/wechatType" icon={require('@/assets/grid_icon_vote2.png')} text="微信投票类刷票" desc="（未开发）"></IconBox>
              <IconBox to="/statictics" icon={require('@/assets/grid_icon_statictics.png')} text="投票统计"></IconBox>
            </IconBoxContainer>
          </div>
          <div className="guide-footer">
            该软件仅供学习用途，擅自使用引发的后果由使用者个人承担。
          </div>
        </div>
    );
  }
}

export default Guide;
