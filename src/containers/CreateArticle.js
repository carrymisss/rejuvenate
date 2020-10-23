import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setPreload from '../actions/preloader';
import CreateArticle from '../components/CreateArticle';

const mapStateToProps = ({ initData }) => ({
   currentUserName: initData.currentUserName,
   // currentUserEmail: initData.currentUserEmail,
   isVerify: initData.isVerify,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(setPreload, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateArticle);
