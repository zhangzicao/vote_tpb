import React  from 'react';
import Title from "@/components/Title"
import {Tabs} from "@/components/TabPages"
import "@/less/pages/vote.less"

class BrushVotesCookieType extends React.PureComponent {
  constructor(props){
    super(props);
    this.state={
      pages:[
          {id:'1', title: '1', to:'/index/brushVotes/cookieType/1'},
          {id:'2', title: '2', to:'/index/brushVotes/cookieType/2'},
          {id:'3', title: '3', to:'/index/brushVotes/cookieType/3'},
          {id:'4', title: '4', to:'/index/brushVotes/cookieType/4'},
          {id:'5', title: '5', to:'/index/brushVotes/cookieType/5'},
          {id:'6', title: '6', to:'/index/brushVotes/cookieType/6'},
          {id:'7', title: '7', to:'/index/brushVotes/cookieType/7'},
          {id:'8', title: '8', to:'/index/brushVotes/cookieType/8'},
          {id:'9', title: '9', to:'/index/brushVotes/cookieType/9'}
          ]
    }
  }
  render() {
    return (
        <div className="content-padding">
          <Title text="免费建站类刷票" subText="（适用cookie限制类）"/>
          <Tabs className="tabpabes-mian-1" pages={this.state.pages} defaultActive={0} />
          {this.props.children}
        </div>
    );
  }
}

export default BrushVotesCookieType;
