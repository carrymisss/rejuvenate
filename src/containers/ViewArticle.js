import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setAppStatus from '../actions/appStatus';
import * as setPreload from '../actions/preloader';
import ViewArticle from '../components/ViewArticle';

const mapStateToProps = ({ initData, appStatus }) => ({
   currentUserName: initData.currentUserName,
   isUserLogin: initData.isUserLogin,
   appStatus: appStatus.appStatus,
});

const mapDispatchToProps = dispatch => ({
   ...bindActionCreators(setAppStatus, dispatch),
   ...bindActionCreators(setPreload, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewArticle);
