import { connect } from 'react-redux';
// import * as setInitialData from '../actions/initData';
import { bindActionCreators } from 'redux';
import * as setPreload from '../actions/preloader';
import * as setAppStatus from '../actions/appStatus';
import UserProfile from '../components/UserProfile';


const mapStateToProps = ({ initData, appStatus }) => ({
   isUserLogin: initData.isUserLogin,
   currentUserName: initData.currentUserName,
   appStatus: appStatus.appStatus,
});

const mapDispatchToProps = dispatch => ({
   ...bindActionCreators(setAppStatus, dispatch),
   ...bindActionCreators(setPreload, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
