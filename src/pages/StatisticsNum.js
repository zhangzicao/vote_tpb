import React  from 'react';
import { connect } from 'react-redux'
import {statisticsDayChange1, statisticsSaveState} from '../stores/actions'
import Select from "@/components/Select"
import { FormItem} from "@/components/Form"
import { dateEqualDay, dateEqualWeek, dateEqualMonth, dateEqualYear, getDaysInMonth } from "@/scripts/common"
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
  }
  componentDidMount(){
    this.initChart();
  }
  componentDidUpdate(prevProps, prevState){
    console.log('componentDidUpdate')
    console.log(prevProps.viewDay1)
    console.log(this.props.viewDay1)
    if(prevProps.viewDay1!==this.props.viewDay1 || (!prevProps.data && this.props.data)){
      console.log('initChart')
      this.initChart();
    }
  }
  initChart(){
    if(this.ctx && this.props.data){
      if(this.myChart)
        this.myChart.destroy();
      //数据筛选
      let filteredData=this.props.data.filter( (item) => {
        if(this.props.viewDay1==='1'){
          return dateEqualDay(item.completeDate, new Date())
        }else if(this.props.viewDay1==='7'){
          return dateEqualWeek(item.completeDate, new Date())
        }else if(this.props.viewDay1==='31'){
          return dateEqualMonth(item.completeDate, new Date())
        }else if(this.props.viewDay1==='365'){
          return dateEqualYear(item.completeDate, new Date())
        }
        return true;
      });

      let labels=[],data=[];
      let today=new Date();
      if(this.props.viewDay1==='1'){
        labels=['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12','13','14','15','16','17','18','19','20','21','22','23','24'];
        for (let i=0;i<labels.length;i++)
          data.push(0)
        filteredData.forEach(function (item) {
          let time1=(new Date(item.completeDate)).getTime();
          let startTime=(new Date(today.getFullYear(),today.getMonth(),today.getDate())).getTime();
          let hour=parseInt((time1-startTime)/3600000)+1;
          data[hour-1]++;
        })
      }else if(this.props.viewDay1==='7'){
        labels=['周日','周一','周二','周三','周四','周五','周六']
        for (let i=0;i<labels.length;i++)
          data.push(0)
        filteredData.forEach(function (item) {
          let day=(new Date(item.completeDate)).getDay();
          data[day]++;
        })
      }else if(this.props.viewDay1==='31'){
        for (let i=0;i<getDaysInMonth(today);i++)
          labels.push(i+1)
        for (let j=0;j<labels.length;j++)
          data.push(0)
        filteredData.forEach(function (item) {
          let date=(new Date(item.completeDate)).getDate();
          data[date-1]++;
        })
      }else if(this.props.viewDay1==='365'){
        labels=['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        for (let i=0;i<labels.length;i++)
          data.push(0)
        filteredData.forEach(function (item) {
          let month=(new Date(item.completeDate)).getMonth();
          data[month]++;
        })
      }
      console.log(labels)

      this.myChart=new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: 'rgba(33, 150, 243, 0.4)',
            borderColor: 'rgba(33, 150, 243,1)',
            borderWidth: 1
          }]
        },
        options: {
          scaleLabel: "<%=value%>aaaa",
          legend:{
            display:false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              }
            }]
          }
        }
      });
    }
  }
  render() {
    return (
        <div className="chart-container">
          <div className="view-day-select-wr">
            <FormItem width="120px">
              <Select size="s" name="viewDay1" value={this.props.persistentState.viewDay1} onChange={this.props.onDayChange}>
                <option value="1">今天</option>
                <option value="7">本周</option>
                <option value="31">本月</option>
                <option value="365">本年度</option>
              </Select>
            </FormItem>
          </div>
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
  let { data, viewDay1, persistentState}=state.statistics;
  return {data, viewDay1, persistentState}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDayChange: (e) => {
      let value = e.target.value;
      dispatch(statisticsSaveState({
        viewDay1:value
      }));
      dispatch(statisticsDayChange1(value))
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