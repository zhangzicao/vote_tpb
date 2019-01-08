import React  from 'react';
import { connect } from 'react-redux'
import { saveVoter } from '../stores/actions'
import Button,{ButtonBar} from "@/components/Button"
import {Form,FormItem} from "@/components/Form"
import Input from "@/components/Input"
import Select from "@/components/Select"
import Switch from "@/components/Switch"
import LogBox from "@/components/LogBox"
import {dateFormat, handleInputChange} from "@/scripts/common"
import BrushVote from "@/scripts/BrushVote"
import "@/less/pages/vote.less"

class VoteCookieType extends React.PureComponent {
  constructor(props){
    super(props);
    console.log(props.initstate)
    this.state={
      voteSite:'',
      voteNo:'',
      voteNum:'',
      voteSpeed:'',
      randomSpeed:true,
      randomIP:true,
      voteUA:'auto',
      isVoting:false,
      isPaused:false,
      voteObj:null,
      voteId:this.props.match.params.id,
      logData:[]
    };
    this.handleChange=handleInputChange.bind(this)
    this.switchChange=this.switchChange.bind(this)
    this.voteStart=this.voteStart.bind(this)
    this.voteEnd=this.voteEnd.bind(this)
    this.votePause=this.votePause.bind(this)
    this.voteContinue=this.voteContinue.bind(this)
    this.voteComplete=this.voteComplete.bind(this)
    this.voteLog=this.voteLog.bind(this)
    this.onClearAll=this.onClearAll.bind(this)
  }
  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.match.params.id!==prevState.voteId){
      return {
        voteSite: '',
        voteNo: '',
        voteNum: '',
        voteSpeed: '',
        randomSpeed: true,
        randomIP: true,
        voteUA: 'auto',
        isVoting: false,
        isPaused: false,
        voteObj: null,
        voteId: nextProps.match.params.id,
        logData: []
      }
    }
    return null;
  }
  switchChange(checked,name){
    //switch切换
    this.setState((prevState)=>({
      [name]:checked
    }))
  }
  voteStart(){
    if(!this.state.voteNum||!this.state.voteNo||!this.state.voteSpeed) return;
    //开始投票
    this.setState((prevState)=>({
      isVoting:true,
      isPaused:false
    }));
    let voteObj=new BrushVote({
      voteSite:this.state.voteSite,
      voteNo:this.state.voteNo,
      voteNum:this.state.voteNum,
      voteSpeed:this.state.voteSpeed,
      randomIP:this.state.randomIP,
      randomSpeed:this.state.randomSpeed,
      voteUA:this.state.voteUA,
      localTest:this.state.voteSite==="",
      complete:this.voteComplete,
      onLog:this.voteLog,
    })
    this.setState((prevState)=>{
      voteObj.start();
      return {
        voteObj:voteObj
      }
    })
  }
  voteEnd(){
    //终止投票
    this.state.voteObj && this.state.voteObj.destroy();
    this.setState((prevState)=>({
      isVoting:false,
      isPaused:false,
      voteObj:null
    }));
  }
  votePause(){
    //暂停投票
    this.state.voteObj && this.state.voteObj.pause()
    this.setState((prevState)=>({
      isPaused:true
    }))
  }
  voteContinue(){
    //继续投票
    this.state.voteObj && this.state.voteObj.continue()
    this.setState((prevState)=>({
      isPaused:false
    }))
  }
  voteComplete(){
    //投票完成
    this.voteEnd();
  }
  voteLog(a1){
    //日志打印区
    let logData={
      message:a1,
      logTime: dateFormat(new Date(),'YYYY-MM-DD')
    };
    this.setState((prevState)=>{
      return {
        logData:[...prevState.logData,logData]
      }
    })
  }
  onClearAll(){
    //清空打印区
    this.setState({
      logData: []
    })
  }
  render() {
    return (
      <div>
        <Form className="form-panel">
          <FormItem labelText="投票地址：" labelWidth="96px" horizontalPadding="25px">
            <Input type="text" align="left" value={this.state.voteSite} name="voteSite" onChange={this.handleChange} placeholder="默认使用本地测试" disabled={this.state.isVoting||this.state.siteType==="local"} autoFocus={true}/>
          </FormItem>
          <FormItem labelText="投票对象：" suffix="号" width="50%" labelWidth="96px" horizontalPadding="25px">
            <Input type="number" align="center" value={this.state.voteNo} name="voteNo" min={1} toInt={true} onChange={this.handleChange} disabled={this.state.isVoting}/>
          </FormItem>
          <FormItem labelText="投票数量：" suffix="票" width="50%" labelWidth="96px" horizontalPadding="25px">
            <Input type="number" align="center" value={this.state.voteNum} name="voteNum" min={1} toInt={true} onChange={this.handleChange} disabled={this.state.isVoting}/>
          </FormItem>
          <FormItem labelText="投票速度：" prefix="一票" suffix="秒" width="50%" labelWidth="96px" horizontalPadding="25px">
            <Input type="number" align="center" value={this.state.voteSpeed} name="voteSpeed" min={0.01} onChange={this.handleChange} disabled={this.state.isVoting}/>
          </FormItem>
          <FormItem labelText="速度波动：" width="50%" labelWidth="96px" horizontalPadding="25px" lineHeight="36px">
            <Switch checked={this.state.randomSpeed} name="randomSpeed" onChange={this.switchChange} disabled={this.state.isVoting} />
          </FormItem>
          <FormItem labelText="手机UA：" labelWidth="96px" horizontalPadding="25px" lineHeight="36px">
            <Select name="voteUA" value={this.state.voteUA} onChange={this.handleChange} disabled={this.state.isVoting} >
              <option value="auto">随机</option>
              <option value="Mozilla/5.0 (Linux; Android 8.1; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools">Mozilla/5.0 (Linux; Android 8.1; PAR-AL00 Build/HUAWEIPAR-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools</option>
              <option value="Mozilla/5.0 (Linux; Android 8.1; EML-AL00 Build/HUAWEIEML-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.143 Crosswalk/24.53.595.0 XWEB/358 MMWEBSDK/23 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN">Mozilla/5.0 (Linux; Android 8.1; EML-AL00 Build/HUAWEIEML-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.143 Crosswalk/24.53.595.0 XWEB/358 MMWEBSDK/23 Mobile Safari/537.36 MicroMessenger/6.7.2.1340(0x2607023A) NetType/4G Language/zh_CN</option>
              <option value="Mozilla/5.0 (Linux; Android 8.0; DUK-AL20 Build/HUAWEIDUK-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044353 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools">Mozilla/5.0 (Linux; Android 8.0; DUK-AL20 Build/HUAWEIDUK-AL20; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044353 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/WIFI Language/zh_CN Process/tools</option>
              <option value="Mozilla/5.0 (Linux; Android 8.0; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/NON_NETWORK Language/zh_CN Process/tools">Mozilla/5.0 (Linux; Android 8.0; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/NON_NETWORK Language/zh_CN Process/tools</option>
              <option value="Mozilla/5.0 (Linux; Android 8.0; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/4G Language/zh_CN Process/tools">Mozilla/5.0 (Linux; Android 8.0; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/6.2 TBS/044304 Mobile Safari/537.36 MicroMessenger/6.7.3.1360(0x26070333) NetType/4G Language/zh_CN Process/tools</option>
              <option value="Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.3(0x16070321) NetType/WIFI Language/zh_CN">Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.3(0x16070321) NetType/WIFI Language/zh_CN</option>
              <option value="Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN">Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366 MicroMessenger/6.7.2 NetType/WIFI Language/zh_CN</option>
            </Select>
          </FormItem>
          <FormItem labelText="随机IP：" width="50%" labelWidth="96px" horizontalPadding="25px" lineHeight="36px">
            <Switch checked={this.state.randomIP} name="randomIP" onChange={this.switchChange} disabled={this.state.isVoting} />
          </FormItem>
          <ButtonBar>
            {
              !this.state.isVoting &&
              <Button type="button" round={true} color="primary" onClick={this.voteStart}>开 始</Button>
            }
            {
              this.state.isVoting && !this.state.isPaused &&
              <Button type="button" round={true} color="warning"onClick={this.votePause}>暂 停</Button>
            }
            {
              this.state.isPaused &&
              <Button type="button" round={true} color="warning"onClick={this.voteContinue}>继 续</Button>
            }
            {
              this.state.isVoting &&
              <Button type="button" round={true} color="danger" onClick={this.voteEnd}>终 止</Button>
            }
          </ButtonBar>
        </Form>
        <LogBox
            logData={this.state.logData}
            onClearAll={this.onClearAll}
            height="80px"
        />
    </div>
    );
  }
  componentWillUnmount(){

    /*this.state.voteObj && this.state.voteObj.destroy();
    this.setState((prevState)=>({
      voteObj:null
    }));*/
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initstate: state.vote[ownProps.match.params.id]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
    }
  }
}

const VoteCookieTypeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(VoteCookieType)

export default VoteCookieTypeContainer