import { connect } from 'react-redux';
// import * as setInitialData from '../actions/initData';
import Bookmarks from '../components/Bookmarks';

const mapStateToProps = ({ initData }) => ({
   currentUserID: initData.currentUserID,
   isUserRegister: initData.userRegister,
});

export default connect(
  mapStateToProps,
  null
)(Bookmarks);
