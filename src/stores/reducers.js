import { combineReducers } from 'redux'
import { VOTE_CREATE, VOTE_PAUSE, VOTE_END, VOTE_START, VOTE_CONTINUE, VOTE_LOG, VOTE_LOG_CLEAR, VOTE_SAVE, STATISTICS_SETDATA, STATISTICS_ADD, STATISTICS_CLEAR, STATISTICS_TAB, STATISTICS_CHANGE_DAY,STATISTICS_CHANGE_PAGELENGTH,STATISTICS_CHANGE_CURRPAGE, STATISTICS_FILTERS, STATISTICS_SAVESTATE } from "@/stores/actions";

function vote(state = {}, action) {
  switch (action.type) {
    case VOTE_CREATE:
      return Object.assign({}, state, {
        [action.data.voteId]:action.option
      })
    case VOTE_START:
      return Object.assign({}, state, {
        [action.voteId]: {
          ...state[action.voteId],
          isVoting:true,
          isPaused:false
        }
      })
    case VOTE_END:
      return Object.assign({}, state, {
        [action.voteId]: {
          ...state[action.voteId],
          isVoting:false,
          isPaused:false,
          voteObj:null
        }
      })
    case VOTE_PAUSE:
      return Object.assign({}, state, {
        [action.voteId]: {
          ...state[action.voteId],
          isPaused:true
        }
      })
    case VOTE_CONTINUE:
      return Object.assign({}, state, {
        [action.voteId]: {
          ...state[action.voteId],
          isPaused:false
        }
      })
    case VOTE_LOG:
      return Object.assign({}, state, {
        [action.voteId]: {
          ...state[action.voteId],
          logData:(state[action.voteId].logData||[]).concat(action.logData)
        }
      })
    case VOTE_LOG_CLEAR:
      return Object.assign({}, state, {
        [action.voteId]: {
          ...state[action.voteId],
          logData:[]
        }
      })
    case VOTE_SAVE:
      return Object.assign({}, state, {
        [action.data.voteId]:{
          ...state[action.data.voteId],
          ...action.data
        }
      })
    default:
      return state
  }
}

function statistics(state = {
  activeIndex:0,//默认标签页
  statisticsDay:1, //默认统计天数
  persistentState:{
    voteType:'', //筛选参数，类型（默认为全部，1为本地测试，2为远程地址）
    voteSite:'', //筛选参数，投票地址
    state:'', //筛选参数，投票结果(默认为全部，包含success,error,aborted)
    voteOptionName:'', //筛选参数，投票目标
    dateFrom:'', //筛选参数，日期范围
    dateTo:'', //筛选参数，日期范围
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

const rootReducer = combineReducers({
  vote,
  statistics
})

export default rootReducer