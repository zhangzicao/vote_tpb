import React  from 'react';
import "@/less/pages/vote.less"
import {DialogPlugin} from '@/components/Dialog'

export default class VoteCookieType extends React.PureComponent {
  componentDidMount() {
    //切换标签页后保存投票数据
    DialogPlugin.toast('本模块已停止开发工作',{time:31500,shade:false})
  }
  render() {
    return (
      <div className="content-padding">未开发</div>
    );
  }
}