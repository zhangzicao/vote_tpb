import React  from 'react';
import { connect } from 'react-redux'
import { clearVoteRecord, statisticsFilterChange, statisticsChangeCurrPage, statisticsChangePageLength, statisticsSaveState } from '../stores/actions'
import  Button from "@/components/Button"
import  Select from "@/components/Select"
import  Input from "@/components/Input"
import  Laypage from "@/components/Laypage"
import  {dateFormat} from "@/scripts/common"
import "@/less/pages/StatisticsNum.less"

class StatisticsNum extends React.PureComponent {
  constructor(props){
    super(props);
    this.filterSearch=this.filterSearch.bind(this)
    this.onChange=this.onChange.bind(this)
  }
  filterSearch(e){
    //查询
    e.preventDefault()
    this.props.statisticsFilterChange({
      ...this.props.persistentState
    })
  }
  onChange(e){
    //表单数据变化
    let name=e.target.name;
    let value=e.target.value;
    this.props.statisticsSaveState({
      [name]:value
    });
  }
  render() {
    let currPageData=[],filteredData=this.props.data,recordsFiltered=this.props.recordsTotal;
    if(this.props.data instanceof Array){
      //筛选、查询
      if(this.props.filters){
        console.log(this.props.data)
        filteredData = this.props.data.filter((item)=>{
          if(this.props.filters.voteType && item.localTest !== (this.props.filters.voteType==="1")){
            return false
          }
          if(item.voteOptionName.search(this.props.filters.voteOptionName||"") === -1){
            return false
          }
          if(this.props.filters.voteType !=="1" && item.voteSite.search(this.props.filters.voteSite||"") === -1){
            return false
          }
          if(this.props.filters.state && item.state !== this.props.filters.state){
            return false
          }
          if(this.props.filters.dateFrom){
            let datetimeFrom=(new Date(this.props.filters.dateFrom)).getTime()
            if(item.completeDate<datetimeFrom)
              return false
          }
          if(this.props.filters.dateTo){
            let datetimeTo=(new Date(this.props.filters.dateTo)).getTime()+86400000
            if(item.completeDate>datetimeTo)
              return false
          }
          return true
        })
        recordsFiltered=filteredData.length;
      }
      //分页
      currPageData = filteredData.slice(this.props.pageLength*(this.props.currPage-1),this.props.pageLength*this.props.currPage)
    }
    let pages=parseInt(((recordsFiltered-1)<0?0:(recordsFiltered-1))/this.props.pageLength)+1;
    return (
        <div className="content-padding">
          <Button className="clear-btn" color="danger" size="s" onClick={this.props.clearVoteRecord}>清空所有记录</Button>
          <div className="table-actions">
            <form className="table-action-filters"  onSubmit={this.filterSearch}>
              类型：
              <div className="input-wrap">
                <Select size="s" name="voteType" value={this.props.persistentState.voteType} onChange={this.onChange}>
                  <option value="">全部</option>
                  <option value="1">本地测试</option>
                  <option value="2">远程地址</option>
                </Select>
              </div>
              投票目标：
              <div className="input-wrap"><Input name="voteOptionName" value={this.props.persistentState.voteOptionName} onChange={this.onChange}/></div>
              <br/>
              投票地址：
              <div className="input-wrap"><Input name="voteSite" value={this.props.persistentState.voteSite} disabled={this.props.persistentState.voteType==="1"} onChange={this.onChange}/></div>
              状态：
              <div className="input-wrap">
                <Select size="s" name="state" value={this.props.persistentState.state} onChange={this.onChange}>
                  <option value="">全部</option>
                  <option value="success">成功</option>
                  <option value="error">失败</option>
                  <option value="aborted">中断</option>
                </Select>
              </div>
              <br/>
              时间范围：
              <div className="input-wrap" style={{marginRight:0}}><Input type="date" name="dateFrom" value={this.props.persistentState.dateFrom}  onChange={this.onChange}/></div>
              —
              <div className="input-wrap"><Input type="date" name="dateTo" value={this.props.persistentState.dateTo}  onChange={this.onChange}/></div>
              <Button size="s">查询</Button>
            </form>
          </div>
          <table className="table-default">
            <thead>
            <tr>
              <th width="240">投票目标</th>
              <th>投票地址</th>
              <th width="180">时间</th>
              <th width="60">状态</th>
            </tr>
            </thead>
            <tbody>
            { this.props.data instanceof Array && currPageData.map((item)=>{
              return (<tr key={item._id}>
                <td>{item.voteOptionName}</td>
                <td>{item.localTest?'本地测试':item.voteSite}</td>
                <td>{dateFormat(item.completeDate,'YYYY-MM-DD hh:mm:ss')}</td>
                <td>{item.state==='success'?'成功':item.state==='error'?<span className="color-red">失败</span>:<span className="color-org">中断</span>}</td>
              </tr>)
            })}
            </tbody>
          </table>
          <div className="table-bottom-bar">
            <div className="table-info">
              共{this.props.recordsTotal}条记录{recordsFiltered!==this.props.recordsTotal&&'（筛选后'+recordsFiltered+'条）'}，每页
              <span className="table-pagelength-select">
                <Select size="s" name="pageLength" value={this.props.pageLength} onChange={this.props.statisticsChangePageLength}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                </Select>
              </span>条
            </div>
            <Laypage className="laypage-pagination" currPage={this.props.currPage} pages={pages} onChange={this.props.statisticsChangeCurrPage}/>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let { data, recordsTotal, pageLength, currPage, filters, persistentState}=state.statistics;
  return {data, recordsTotal, pageLength, currPage, filters, persistentState}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    clearVoteRecord: () => {
      dispatch(statisticsChangeCurrPage(1))
      dispatch(clearVoteRecord())
    },
    statisticsChangeCurrPage: (currPage) => {
      dispatch(statisticsChangeCurrPage(currPage))
    },
    statisticsChangePageLength: (e) => {
      dispatch(statisticsChangePageLength(e.target.value))
    },
    statisticsFilterChange: (filters) => {
      dispatch(statisticsChangeCurrPage(1))
      dispatch(statisticsFilterChange(filters))
    },
    statisticsSaveState: (data) => {
      dispatch(statisticsSaveState(data))
    }
  }
}

const StatisticsNumContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(StatisticsNum)

export default StatisticsNumContainer