import {store} from "@/stores"
import Statistics from "@/scripts/Statistics";

export const STATISTICS_SETDATA = 'STATISTICS_SETDATA'
export const STATISTICS_ADD = 'STATISTICS_ADD'
export const STATISTICS_CLEAR = 'STATISTICS_CLEAR'
export const STATISTICS_TAB = 'STATISTICS_TAB'
export const STATISTICS_CHANGE_DAY_1 = 'STATISTICS_CHANGE_DAY_1'
export const STATISTICS_CHANGE_DAY = 'STATISTICS_CHANGE_DAY'
export const STATISTICS_CHANGE_DAYRANGE = 'STATISTICS_CHANGE_DAYRANGE'
export const STATISTICS_CHANGE_PAGELENGTH = 'STATISTICS_CHANGE_PAGELENGTH'
export const STATISTICS_CHANGE_CURRPAGE = 'STATISTICS_CHANGE_CURRPAGE'
export const STATISTICS_SAVESTATE = 'STATISTICS_SAVESTATE'
export const STATISTICS_FILTERS = 'STATISTICS_FILTERS'

//加载数据库中的统计数据
export function setStatisticsData(data) {
  return {
    type: STATISTICS_SETDATA,
    data:data.sort(function (x,y) {
      if(x.completeDate > y.completeDate)
        return -1
      else if(x.completeDate < y.completeDate)
        return 1
      else return 0;
    })
  }
}


//添加统计记录
export function addVoteRecord(data) {
  return function(dispatch){
    Statistics.add(data,function (err,newData) {
      if(err) return;
      if(typeof store.getState().statistics.data==='undefined') return;
      //在redux中添加新纪录添加
      //dispatch(addVoteRecordSuccess(newData))
    })
  }
}
export function addVoteRecordSuccess(data) {
  return {
    type: STATISTICS_ADD,
    data,
  }
}

//清空统计记录
export function clearVoteRecord() {
  Statistics.clear()
  return {
    type: STATISTICS_CLEAR
  }
}

//统计页面当前标签页index
export function statisticsTab(activeIndex) {
  return {
    type: STATISTICS_TAB,
    activeIndex:activeIndex
  }
}

//统计页面统计天数(数量统计)
export function statisticsDayChange1(value) {
  return {
    type: STATISTICS_CHANGE_DAY_1,
    viewDay1:value
  }
}

//统计页面统计天数（成功率统计）
export function statisticsDayChange(value) {
  return {
    type: STATISTICS_CHANGE_DAY,
    viewDay:value
  }
}

//统计页面统计范围
export function statisticsDayRangeChange(value1,value2) {
  return {
    type: STATISTICS_CHANGE_DAYRANGE,
    viewDayFrom:value1,
    viewDayTo:value2,
  }
}

//改变分页大小
export function statisticsChangePageLength(pageLength) {
  return {
    type: STATISTICS_CHANGE_PAGELENGTH,
    pageLength:pageLength
  }
}


//改变当前页
export function statisticsChangeCurrPage(currPage) {
  return {
    type: STATISTICS_CHANGE_CURRPAGE,
    currPage:currPage
  }
}

//统计页面表单持久化状态
export function statisticsSaveState(data) {
  return {
    type: STATISTICS_SAVESTATE,
    state:data
  }
}

//统计页面筛选表单
export function statisticsFilterChange(filters) {
  return {
    type: STATISTICS_FILTERS,
    filters
  }
}