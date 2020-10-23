import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setInitialData from '../actions/initData';
import * as setPreload from '../actions/preloader';
import App from '../components/App';

const mapStateToProps = ({ initData, loader }) => ({
  isUserLogin: initData.isUserLogin,
  isPreLoading: loader.loading,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setInitialData, dispatch),
  ...bindActionCreators(setPreload, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
