import BrushVote from "@/scripts/BrushVote";
import {dateFormat} from "@/scripts/common";
import {store} from "@/stores"
import {addVoteRecord} from "@/stores/actions";

export const VOTE_CREATE = 'VOTE_CREATE'
export const VOTE_START = 'VOTE_START'
export const VOTE_END = 'VOTE_END'
export const VOTE_PAUSE = 'VOTE_PAUSE'
export const VOTE_CONTINUE = 'VOTE_CONTINUE'
export const VOTE_LOG = 'VOTE_LOG'
export const VOTE_LOG_CLEAR = 'VOTE_LOG_CLEAR'
export const VOTE_SAVE = 'VOTE_SAVE'

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