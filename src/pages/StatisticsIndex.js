import React  from 'react';
import { connect } from 'react-redux'
import { statisticsTab, setStatisticsData } from '../stores/actions'
import {Tabs} from "@/components/TabPages"
import  Statistics from "@/scripts/Statistics"
import "@/less/pages/StatisticsIndex.less"

class StatisticsIndex extends React.PureComponent {
  constructor(props){
    super(props);
    this.pages=[
      {id:'1', title: '刷票数量统计', to:'/statistics/num'},
      {id:'2', title: '刷票成功率统计', to:'/statistics/successRate'},
      {id:'3', title: '刷票记录列表', to:'/statistics/list'},
    ]
    this.getStatisticsData=this.getStatisticsData.bind(this);
    this.getStatisticsData();
  }
  getStatisticsData(){
    Statistics.get( (data) => {
      this.props.setStatisticsData(data)
    });
  }
  componentDidMount(){
    //根据redux状态跳转
    if(this.props.activeIndex===1){
      this.props.history.push('/statistics/successRate')
    }else if(this.props.activeIndex===2){
      this.props.history.push('/statistics/list')
    }
  }
  render() {
    return (
        <div className="content-padding">
          <Tabs className="tabpabes-mian-2" pages={this.pages} defaultActive={this.props.activeIndex||0} onTab={this.props.statisticsTab}>
            <span className="btn-refresh-data" onClick={this.getStatisticsData}>刷新</span>
          </Tabs>
          {this.props.children}
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let { activeIndex, data }=state.statistics;
  return { activeIndex, data }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    statisticsTab: (index) => {
      dispatch(statisticsTab(index))
    },
    setStatisticsData: (data) => {
      dispatch(setStatisticsData(data))
    }
  }
}

const StatisticsIndexContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StatisticsIndex)

export default StatisticsIndexContainer