import { combineReducers } from 'redux';

import loader from './loader';
import initData from './initData';
import appStatus from './appStatus';

export default combineReducers({
   loader,
   initData,
   appStatus,
});
