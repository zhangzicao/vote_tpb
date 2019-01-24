import {applyMiddleware, createStore} from "redux";
import rootReducer from "@/stores/reducers";
import thunkMiddleware from "redux-thunk";

import Win from '@/scripts/WinInterface';
import {winMinimize,winMaximize, winRestore, winHide, winShow} from '@/stores/actions'

Win.on("requestWinMinimize",function () {
  store.dispatch(winMinimize(Win))
})
Win.on("requestWinMaximize",function () {
  store.dispatch(winMaximize(Win))
})
Win.on("requestWinRestore",function () {
  store.dispatch(winRestore(Win))
})
Win.on("requesWintHide",function () {
  store.dispatch(winHide(Win))
})
Win.on("requestWinShow",function () {
  store.dispatch(winShow(Win))
})

export const store=createStore(rootReducer,
  applyMiddleware(
      thunkMiddleware, // 允许我们 dispatch() 函数
  ));