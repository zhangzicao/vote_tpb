import Win from '@/scripts/WinInterface';
import { WIN_MAX, WIN_MIN, WIN_RESTORE, WIN_CLOSE, WIN_HIDE, WIN_SHOW} from "./action";

export default function(state = {
  [Win.id]:{
    isVisible:Win.isVisible(),
    isMaximized:Win.isMaximized(),
    isMinimized:Win.isMinimized()
  }
}, action) {
  switch (action.type) {
    case WIN_MAX:
      return Object.assign({}, state, {
        [action.id]:{
          isMaximized:true,
          isMinimized:false,
          isVisible:state[action.id].isVisible
        }
      })
    case WIN_MIN:
      return Object.assign({}, state, {
        [action.id]: {
          isMaximized: false,
          isMinimized: true,
          isVisible:state[action.id].isVisible
        }
      })
    case WIN_RESTORE:
      return Object.assign({}, state, {
        [action.id]:{
          isMaximized:false,
          isMinimized:false,
          isVisible:state[action.id].isVisible
        }
      })
    case WIN_CLOSE:
      return Object.assign({}, state, {
        [action.id]: undefined
      })
    case WIN_HIDE:
      return Object.assign({}, state, {
        [action.id]: {
          isMaximized:state[action.id].isMaximized,
          isMinimized:state[action.id].isMinimized,
          isVisible:false,
        }
      })
    case WIN_SHOW:
      return Object.assign({}, state, {
        [action.id]: {
          isMaximized:state[action.id].isMaximized,
          isMinimized:state[action.id].isMinimized,
          isVisible:true,
        }
      })
    default:
      return state
  }
}