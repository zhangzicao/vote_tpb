import { VOTE_CREATE, VOTE_PAUSE, VOTE_END, VOTE_START, VOTE_CONTINUE, VOTE_LOG, VOTE_LOG_CLEAR, VOTE_SAVE } from "@/stores/actions";

export default function(state = {}, action) {
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