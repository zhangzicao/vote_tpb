import React  from 'react';
import { connect } from 'react-redux'
import {statisticsDayChange, statisticsDayRangeChange, statisticsSaveState} from '../stores/actions'
import Select from "@/components/Select"
import Input from "@/components/Input"
import Button from "@/components/Button"
import {Form,FormItem} from "@/components/Form"
import { dateEqualDay, dateEqualWeek, dateEqualMonth, dateEqualYear, dateIsBetween } from "@/scripts/common"
import Chart from 'chart.js';
import "@/less/pages/StatisticsSuccessRate.less"

class StatisticsSuccessRate extends React.PureComponent {
  constructor(props){
    super(props);
    this.setRef=element => {
      this.ctx = element;
      if(this.ctx){
        this.ctx.width = element.offsetWidth;
        this.ctx.height = element.offsetHeight;
      }
    };
    this.initChart=this.initChart.bind(this)
    this.customRange=this.customRange.bind(this)
  }
  componentDidMount(){
    this.initChart();
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.viewDay!==this.props.viewDay
        || (this.props.viewDay==='0' && ( prevProps.viewDayFrom !== this.props.viewDayFrom || prevProps.viewDayTo !== this.props.viewDayTo ))
        || (!prevProps.data && this.props.data)){
      this.initChart();
    }
  }
  initChart(){
    if(this.ctx && this.props.data){
      if(this.myChart)
        this.myChart.destroy();
      //数据筛选
      let filteredData=this.props.data.filter( (item) => {
        if(this.props.viewDay==='1'){
          return dateEqualDay(item.completeDate, new Date())
        }else if(this.props.viewDay==='7'){
          return dateEqualWeek(item.completeDate, new Date())
        }else if(this.props.viewDay==='31'){
          return dateEqualMonth(item.completeDate, new Date())
        }else if(this.props.viewDay==='365'){
          return dateEqualYear(item.completeDate, new Date())
        }else if(this.props.viewDay==='0'){
          return dateIsBetween(item.completeDate, this.props.viewDayFrom||0, this.props.viewDayTo||'2222/12/12')
        }
        return true;
      });
      let successTime=filteredData.filter((item)=>{
        return item.state === 'success'
      }).length
      let errorTime=filteredData.filter((item)=>{
        return item.state === 'error'
      }).length
      let abortedTime=filteredData.filter((item)=>{
        return item.state === 'aborted'
      }).length

      this.myChart=new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: ["成功", "失败", "中断"],
          datasets: [{
            data: [successTime, errorTime, abortedTime],
            backgroundColor: [
              'rgba(76, 175, 80, 0.4)',
              'rgba(244, 29, 29, 0.4)',
              'rgba(255, 206, 86, 0.4)'
            ],
            borderColor: [
              'rgba(76, 175, 80,1)',
              'rgba(244, 29, 29, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          layout:{
            padding:{
              top:10,
              right:40,
              bottom:40,
              left:40,
            }
          }
        }
      });
    }
  }
  customRange(e){
    e.preventDefault()
    this.props.statisticsDayRangeChange(this.props.persistentState.viewDayFrom,this.props.persistentState.viewDayTo)
  }
  render() {
    let displayType={ display:this.props.persistentState.viewDay!=='0'?'none':null };
    return (
        <div className="chart-container">
          <div className="view-day-select-wr">
            <FormItem width="120px">
              <Select size="s" name="viewDay" value={this.props.persistentState.viewDay} onChange={this.props.onDayChange}>
                <option value="all">所有</option>
                <option value="1">今天</option>
                <option value="7">本周</option>
                <option value="31">本月</option>
                <option value="365">本年度</option>
                <option value="0">范围</option>
              </Select>
            </FormItem>
          </div>
          <Form onSubmit={this.customRange} className="view-day-range-form">
            <FormItem labelText="范围：" width="260px" labelWidth="48px" style={displayType}>
              <Input type="date" name="viewDayFrom" value={this.props.persistentState.viewDayFrom}  onChange={this.props.statisticsSaveState}/>
            </FormItem>
            <FormItem width="260px" prefix="—" horizontalPadding="0 25px" style={displayType}>
              <Input type="date" name="viewDayTo" value={this.props.persistentState.viewDayTo}  onChange={this.props.statisticsSaveState}/>
            </FormItem>
            <FormItem width="90px" style={displayType}>
              <Button size="s">确认</Button>
            </FormItem>
          </Form>
          <canvas ref={this.setRef} className="my-chart"></canvas>
        </div>
    );
  }
  componentWillUnmount(){
    if(this.myChart)
      this.myChart.destroy();
  }
}

const mapStateToProps = (state, ownProps) => {
  let { data, viewDay, viewDayFrom, viewDayTo, persistentState}=state.statistics;
  return {data, viewDay, viewDayFrom, viewDayTo, persistentState}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDayChange: (e) => {
      let value = e.target.value;
      dispatch(statisticsSaveState({
        viewDay:value
      }));
      if( value!=='0')
        dispatch(statisticsDayChange(value))
    },
    statisticsDayRangeChange: (from, to) => {
      dispatch(statisticsDayRangeChange(from, to))
    },
    statisticsSaveState: (e) => {
      //表单数据变化
      let name=e.target.name;
      let value=e.target.value;
      dispatch(statisticsSaveState({
        [name]:value
      }));
    }
  }
}

const StatisticsSuccessRateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StatisticsSuccessRate)

export default StatisticsSuccessRateContainer