import {dateFormat} from "@/scripts/common";
import {store} from "@/stores"
import BrushVote from "@/scripts/BrushVote";
import Statistics from "@/scripts/Statistics";

export const VOTE_CREATE = 'VOTE_CREATE'
export const VOTE_START = 'VOTE_START'
export const VOTE_END = 'VOTE_END'
export const VOTE_PAUSE = 'VOTE_PAUSE'
export const VOTE_CONTINUE = 'VOTE_CONTINUE'
export const VOTE_LOG = 'VOTE_LOG'
export const VOTE_LOG_CLEAR = 'VOTE_LOG_CLEAR'
export const VOTE_SAVE = 'VOTE_SAVE'

export const STATISTICS_SETDATA = 'STATISTICS_SETDATA'
export const STATISTICS_ADD = 'STATISTICS_ADD'
export const STATISTICS_CLEAR = 'STATISTICS_CLEAR'
export const STATISTICS_TAB = 'STATISTICS_TAB'
export const STATISTICS_CHANGE_DAY = 'STATISTICS_CHANGE_DAY'
export const STATISTICS_CHANGE_PAGELENGTH = 'STATISTICS_CHANGE_PAGELENGTH'
export const STATISTICS_CHANGE_CURRPAGE = 'STATISTICS_CHANGE_CURRPAGE'
export const STATISTICS_SAVESTATE = 'STATISTICS_SAVESTATE'
export const STATISTICS_FILTERS = 'STATISTICS_FILTERS'


export function voteCreate(option) {
  return function (dispatch) {
    const voteObj=new BrushVote({
      ...option,
      localTest:option.voteSite==="",
      complete:function () {
        dispatch(voteEnd(option.voteId))
      },
      onLog:function (msg) {
        dispatch(voteLog(option.voteId,msg))
      },
      onVote:function (data) {
        dispatch(addVoteRecord(data))
      }
    });
    dispatch(voteSave({...option,voteObj:voteObj}))
  }
}
export function voteStart(voteId) {
  store.getState().vote[voteId].voteObj.start()
  return {
    type: VOTE_START,
    voteId
  }
}
export function voteEnd(voteId) {
  store.getState().vote[voteId].voteObj.destroy()
  return {
    type: VOTE_END,
    voteId
  }
}
export function votePause(voteId) {
  store.getState().vote[voteId].voteObj.pause()
  return {
    type: VOTE_PAUSE,
    voteId
  }
}
export function voteContinue(voteId) {
  store.getState().vote[voteId].voteObj.continue()
  return {
    type: VOTE_CONTINUE,
    voteId
  }
}
export function voteLog(voteId,msg) {
  return {
    type: VOTE_LOG,
    voteId,
    logData:{
      message:msg,
      logTime: dateFormat(new Date(),'YYYY-MM-DD')
    }
  }
}
export function voteLogClear(voteId) {
  return {
    type: VOTE_LOG_CLEAR,
    voteId
  }
}
export function voteSave(data) {
  return {
    type: VOTE_SAVE,
    data
  }
}



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

//统计页面统计天数
export function statisticsDayChange(value) {
  return {
    type: STATISTICS_CHANGE_DAY,
    viewDay:value
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