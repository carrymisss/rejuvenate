import * as serviceWorker from './serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import ErrorBoundary from './components/ErrorBoundary';

// import 'antd/dist/antd.less';
// import './index.scss';

import 'feather-icons/dist/feather.min.js';

import createStore from './store';
const store = createStore();

ReactDOM.render(
  <Provider store={store}>
     <ErrorBoundary>
        <App />
     </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
