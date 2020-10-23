import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setAppStatus from '../actions/appStatus';
import * as setPreload from '../actions/preloader';
import EditArticle from '../components/EditArticle';

const mapStateToProps = ({ appStatus }) => ({
   appStatus: appStatus.appStatus,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setAppStatus, dispatch),
  ...bindActionCreators(setPreload, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditArticle);
