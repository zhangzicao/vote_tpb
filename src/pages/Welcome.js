import React  from 'react';
import "@/less/pages/Guide.less"
import Button from "@/components/Button"

class Welcome extends React.PureComponent {
  render() {
    return (
        <div className="welcome-content">
          <div className="guide-content-inner">
            <div className="logo-wrap"><img src={require('@/assets/logo.png')} alt="刷投票吧" /></div>
            <div className="app-desc">用于投票吧vote8的刷投票的HTML5桌面应用</div>
            <div className="app-desc-secondary">基于electron+react开发</div>
            <div className="app-welcome-btnwr">
              <Button type="button" color="primary" round={true} to="/index/guide" size="l">开始使用</Button>
            </div>
          </div>
          <div className="guide-footer">
            该软件仅供学习用途，擅自使用引发的后果由使用者个人承担。
          </div>
        </div>
    );
  }
}

export default Welcome;
