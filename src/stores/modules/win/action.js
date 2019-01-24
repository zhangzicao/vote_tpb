import {DialogPlugin} from '@/components/Dialog'

export const WIN_MIN = 'WIN_MIN'
export const WIN_MAX = 'WIN_MAX'
export const WIN_RESTORE = 'WIN_RESTORE'
export const WIN_CLOSE = 'WIN_CLOSE'
export const WIN_HIDE = 'WIN_HIDE'
export const WIN_SHOW = 'WIN_SHOW'

export function winMinimize(Win) {
  Win.minimize();
  return {
    type: WIN_MIN,
    id: Win.id
  }
}
export function winMaximize(Win) {
  Win.maximize();
  return {
    type: WIN_MAX,
    id: Win.id
  }
}
export function winRestore(Win) {
  Win.restore();
  return {
    type: WIN_RESTORE,
    id: Win.id
  }
}
export function winClose(Win) {
  Win.close();
  return {
    type: WIN_CLOSE,
    id: Win.id
  }
}
export function winHide(Win) {
  Win.hide();
  return {
    type: WIN_HIDE,
    id: Win.id
  }
}
export function winShow(Win) {
  Win.show();
  return {
    type: WIN_SHOW,
    id: Win.id
  }
}
export function winCloseConfirm(Win) {
  return function(dispatch) {
    let closeDialog=DialogPlugin.open({
      type:'confirm',
      title:"最小化or退出",
      content:'是否要退出应用？',
      btn:[{text:'退出应用',type:"danger"},'最小化','取消'],
      btn1:function () {
        dispatch(winClose(Win))
      },
      btn2:function () {
        closeDialog();
        setTimeout(function () {
          dispatch(winHide(Win))
        },20)
      }
    })
  }
}