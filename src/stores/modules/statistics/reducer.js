import {
  STATISTICS_ADD, STATISTICS_CHANGE_CURRPAGE, STATISTICS_CHANGE_DAY, STATISTICS_CHANGE_DAY_1,
  STATISTICS_CHANGE_DAYRANGE, STATISTICS_CHANGE_PAGELENGTH, STATISTICS_CLEAR, STATISTICS_FILTERS, STATISTICS_SAVESTATE,
  STATISTICS_SETDATA, STATISTICS_TAB
} from "@/stores/actions";

export default function(state = {
  activeIndex:0,//默认标签页
  viewDay1:'1', //默认统计天数(数量统计)
  viewDay:'all', //默认统计天数
  viewDayFrom:"", //默认统计图表显示的范围开始日期
  viewDayTo:"", //默认统计图表显示的范围结束日期
  persistentState:{
    voteType:'', //筛选参数，类型（默认为全部，1为本地测试，2为远程地址）
    voteSite:'', //筛选参数，投票地址
    state:'', //筛选参数，投票结果(默认为全部，包含success,error,aborted)
    voteOptionName:'', //筛选参数，投票目标
    dateFrom:'', //筛选参数，日期范围
    dateTo:'', //筛选参数，日期范围
    viewDay1:'1',
    viewDay:'all',
    viewDayFrom:"", //默认统计图表显示的范围开始日期
    viewDayTo:"", //默认统计图表显示的范围结束日期
  },
  pageLength:10, //分页大小
  currPage:1, //当前页
  recordsTotal:0,//总记录数
}, action) {
  switch (action.type) {
    case STATISTICS_SETDATA:
      return Object.assign({}, state, {
        data:action.data,
        recordsTotal: action.data.length,
        successTime: action.data.filter((item)=>{
          return item.state==='success'
        }).length,
        errorTime: action.data.filter((item)=>{
          return item.state==='error'
        }).length,
        abortedTime: action.data.filter((item)=>{
          return item.state==='aborted'
        }).length,
      })
    case STATISTICS_ADD:
      return Object.assign({}, state, {
        recordsTotal: (state.recordsTotal||0)+1,
        successTime: (state.recordsTotal||0)+(action.data.state==='success'?1:0),
        errorTime: (state.errorTime||0)+(action.data.state==='error'?1:0),
        abortedTime: (state.abortedTime||0)+(action.data.state==='aborted'?1:0),
        data: [action.data].concat(state.data||[]),
      })
    case STATISTICS_CLEAR:
      return Object.assign({}, state, {
        recordsTotal: 0,
        successTime: 0,
        errorTime: 0,
        abortedTime: 0,
        data: [],
      })
    case STATISTICS_TAB:
      return Object.assign({}, state, {
        activeIndex:action.activeIndex,
      })
    case STATISTICS_CHANGE_DAY:
      return Object.assign({}, state, {
        viewDay:action.viewDay,
      })
    case STATISTICS_CHANGE_DAY_1:
      return Object.assign({}, state, {
        viewDay1:action.viewDay1,
      })
    case STATISTICS_CHANGE_DAYRANGE:
      return Object.assign({}, state, {
        viewDay:'0',
        viewDayFrom:action.viewDayFrom,
        viewDayTo:action.viewDayTo,
      })
    case STATISTICS_CHANGE_CURRPAGE:
      return Object.assign({}, state, {
        currPage:action.currPage
      })
    case STATISTICS_CHANGE_PAGELENGTH:
      return Object.assign({}, state, {
        pageLength:action.pageLength
      })
    case STATISTICS_SAVESTATE:
      return Object.assign({}, state, {
        persistentState:{
          ...state.persistentState,
          ...action.state
        }
      })
    case STATISTICS_FILTERS:
      return Object.assign({}, state, {
        filters:{
          ...state.filters,
          ...action.filters
        }
      })
    default:
      return state
  }
}