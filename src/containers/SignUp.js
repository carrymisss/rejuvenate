import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setInitialData from '../actions/initData';
import * as setPreload from '../actions/preloader';
import SignUp from '../components/SignUp';

// const mapStateToProps = ({ initData, loader }) => ({
//   userRegister: initData.userRegister,
// });

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setInitialData, dispatch),
  ...bindActionCreators(setPreload, dispatch),
});

export default connect(
  null,
  mapDispatchToProps,
)(SignUp);
