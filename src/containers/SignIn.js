import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setInitialData from '../actions/initData';
import * as setLoading from '../actions/preloader';
import SignIn from '../components/SignIn';

// const mapStateToProps = ({ initData, loader }) => ({
//   userRegister: initData.userRegister,
// });

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setInitialData, dispatch),
  ...bindActionCreators(setLoading, dispatch),
});

export default connect(
  null,
  mapDispatchToProps,
)(SignIn);
