import { combineReducers } from 'redux'
import vote from './modules/vote/reducer'
import statistics from './modules/statistics/reducer'
import win from './modules/win/reducer'

const rootReducer = combineReducers({
  vote,
  statistics,
  win
})

export default rootReducer