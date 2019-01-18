import React  from 'react';
import { connect } from 'react-redux'
import { voteCreate, voteStart, voteEnd, votePause, voteContinue ,voteLogClear, voteSave} from '../stores/actions'
import Button,{ButtonBar} from "@/components/Button"
import {Form,FormItem} from "@/components/Form"
import Input from "@/components/Input"
import Select from "@/components/Select"
import Switch from "@/components/Switch"
import LogBox from "@/components/LogBox"
import { handleInputChange,switchChange} from "@/scripts/common"
import "@/less/pages/vote.less"

class VoteCookieType extends React.PureComponent {
  constructor(props){
    super(props);
    this.state={
      voteSite:props.voteSite||'',
      voteNo:props.voteNo||'',
      voteNum:props.voteNum||'',
      voteSpeed:props.voteSpeed||'',
      randomSpeed:props.randomSpeed||true,
      randomIP:props.randomIP||true,
      voteUA:props.voteUA||'auto',
      voteId:this.props.match.params.id,
    };
    this.handleChange=handleInputChange.bind(this)
    this.switchChange=switchChange.bind(this)
    this.voteStart=this.voteStart.bind(this)
  }
  static getDerivedStateFromProps(nextProps, prevState){
    //切换标签页时加载已保存数据或空表单
    if(nextProps.match.params.id!==prevState.voteId){
      return {
        voteSite:nextProps.voteSite||'',
        voteNo:nextProps.voteNo||'',
        voteNum:nextProps.voteNum||'',
        voteSpeed:nextProps.voteSpeed||'',
        randomSpeed:nextProps.randomSpeed||true,
        randomIP:nextProps.randomIP||true,
        voteUA:nextProps.voteUA||'auto',
        voteId: nextProps.match.params.id,
      }
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //切换标签页后保存投票数据
    if(prevProps.match.params.id!==this.props.match.params.id){
      this.props.voteSave({...prevState})
    }
  }
  voteStart(){
    if(!this.state.voteNum||!this.state.voteNo||!this.state.voteSpeed) return;
    //开始投票
    let option={
      voteId:this.state.voteId,
      voteSite:this.state.voteSite,
      voteNo:this.state.voteNo,
      voteNum:this.state.voteNum,
      voteSpeed:this.state.voteSpeed,
      randomIP:this.state.randomIP,
      randomSpeed:this.state.randomSpeed,
      voteUA:this.state.voteUA
    };
    this.props.voteStart(option);
  }
  render() {
    return (
      <div>
        <Form className="form-panel">
          <FormItem labelText="投票地址：" labelWidth="96px" horizontalPadding="25px">
            <Input type="text" align="left" value={this.state.voteSite} name="voteSite" onChange={this.handleChange} placeholder="默认使用本地测试" disabled={this.props.isVoting||this.state.siteType==="local"} autoFocus={true}/>
          </FormItem>
          <FormItem labelText="投票对象：" suffix="号" width="50%" labelWidth="96px" horizontalPadding="25px">
            <Input type="number" align="center" value={this.state.voteNo} name="voteNo" min={1} toInt={true} onChange={this.handleChange} disabled={this.props.isVoting}/>
          </FormItem>
          <FormItem labelText="投票数量：" suffix="票" width="50%" labelWidth="96px" horizontalPadding="25px">
            <Input type="number" align="center" value={this.state.voteNum} name="voteNum" min={1} toInt={true} onChange={this.handleChange} disabled={this.props.isVoting}/>
          </FormItem>
          <FormItem labelText="投票速度：" prefix="一票" suffix="秒" width="50%" labelWidth="96px" horizontalPadding="25px">
            <Input type="number" align="center" value={this.state.voteSpeed} name="voteSpeed" min={0.01} onChange={this.handleChange} disabled={this.props.isVoting}/>
          </FormItem>
          <FormItem labelText="速度波动：" width="50%" labelWidth="96px" horizontalPadding="25px" lineHeight="36px">
            <Switch checked={this.state.randomSpeed} name="randomSpeed" onChange={this.switchChange} disabled={this.props.isVoting} />
          </FormItem>
          <FormItem labelText="手机UA：" labelWidth="96px" horizontalPadding="25px" lineHeight="36px">
            <Select name="voteUA" value={this.state.voteUA} onChange={this.handleChange} disabled={this.props.isVoting} >
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
            <Switch checked={this.state.randomIP} name="randomIP" onChange={this.switchChange} disabled={this.props.isVoting} />
          </FormItem>
          <ButtonBar>
            {
              !this.props.isVoting &&
              <Button type="button" round={true} color="primary" onClick={this.voteStart}>开 始</Button>
            }
            {
              this.props.isVoting && !this.props.isPaused &&
              <Button type="button" round={true} color="warning"onClick={this.props.votePause}>暂 停</Button>
            }
            {
              this.props.isPaused &&
              <Button type="button" round={true} color="warning"onClick={this.props.voteContinue}>继 续</Button>
            }
            {
              this.props.isVoting &&
              <Button type="button" round={true} color="danger" onClick={this.props.voteEnd}>终 止</Button>
            }
          </ButtonBar>
        </Form>
        <LogBox
            logData={this.props.logData}
            onClearAll={this.props.onClearAll}
            height="120px"
        />
    </div>
    );
  }
  componentWillUnmount(){
    //销毁时保存投票数据
    this.props.voteSave(this.state)
  }
}

const mapStateToProps = (state, ownProps) => {
  let { voteSite, voteNo, voteNum, voteSpeed, randomSpeed, randomIP, voteUA, voteId, logData, isVoting, isPaused, voteObj }=state.vote[ownProps.match.params.id]||{};
  return {
    voteSite, voteNo, voteNum, voteSpeed, randomSpeed, randomIP, voteUA, voteId, logData, isVoting, isPaused, voteObj
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    voteStart: (option) => {
      dispatch(voteCreate(option))
      dispatch(voteStart(ownProps.match.params.id))
    },
    voteEnd: () => {
      dispatch(voteEnd(ownProps.match.params.id))
    },
    votePause: () => {
      dispatch(votePause(ownProps.match.params.id))
    },
    voteContinue: () => {
      dispatch(voteContinue(ownProps.match.params.id))
    },
    voteSave: (data) => {
      dispatch(voteSave(data))
    },
    onClearAll: () => {
      dispatch(voteLogClear(ownProps.match.params.id))
    },
  }
}

const VoteCookieTypeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(VoteCookieType)

export default VoteCookieTypeContainer