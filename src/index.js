import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware} from 'redux'
import rootReducer from './stores/reducers'

//路由
import Routers from "@/router"

const store=createStore(rootReducer,
    applyMiddleware(
        thunkMiddleware, // 允许我们 dispatch() 函数
    ));

ReactDOM.render(
    <Provider store={store}>
      <Routers />
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
