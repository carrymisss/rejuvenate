import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setInitialData from '../actions/initData';
import * as setPreload from '../actions/preloader';
import HeaderIsRegister from '../components/HeaderIsRegister';

const mapStateToProps = ({ initData }) => ({
  currentUserName: initData.currentUserName,
  currentUserAvatar: initData.currentUserAvatar,
  isVerify: initData.isVerify,
});

const mapDispatchToProps = dispatch => ({
   ...bindActionCreators(setPreload, dispatch),
  ...bindActionCreators(setInitialData, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderIsRegister);
