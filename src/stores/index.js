import {applyMiddleware, createStore} from "redux";
import rootReducer from "@/stores/reducers";
import thunkMiddleware from "redux-thunk";

export const store=createStore(rootReducer,
  applyMiddleware(
      thunkMiddleware, // 允许我们 dispatch() 函数
  ));