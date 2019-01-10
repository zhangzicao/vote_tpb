import React  from 'react';
import { connect } from 'react-redux'
import {statisticsDayChange } from '../stores/actions'
import Select from "@/components/Select"
import Input from "@/components/Input"
import Chart from 'chart.js';
import "@/less/pages/StatisticsSuccessRate.less"

class StatisticsSuccessRate extends React.PureComponent {
  constructor(props){
    super(props);
    this.setRef=element => {
      this.ctx = element;
    };
  }
  componentDidMount(){
    if(this.ctx){
      this.myChart=new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
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
          <div className="f-r">
            <div className="form-item">
              <Input type="date" />
            </div>—<Input type="date" />
            <Select size="s" name="statisticsDay" value={this.props.statisticsDay} onChange={this.props.onDayChange}>
              <option value="1">今天</option>
              <option value="7">本周</option>
              <option value="31">本月</option>
              <option value="365">本年度</option>
              <option value="0">自定义范围</option>
            </Select>
          </div>
          <canvas ref={this.setRef} height="500" className="my-chart"></canvas>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let { data, recordsTotal, statisticsDay}=state.statistics;
  return {data, recordsTotal,statisticsDay}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDayChange: (e) => {
      dispatch(statisticsDayChange(e.target.value))
    }
  }
}

const StatisticsSuccessRateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StatisticsSuccessRate)

export default StatisticsSuccessRateContainer