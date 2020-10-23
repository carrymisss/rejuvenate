import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as setPreload from '../actions/preloader';
import * as setInitialData from '../actions/initData';
import * as setNewAvatar from '../actions/renewAvatar';
import * as setNewUsername from '../actions/renewUsername';
import * as setNewFullname from '../actions/renewFullname';
import * as setNewEmail from '../actions/renewEmail';
import Settings from '../components/Settings';

const mapStateToProps = ({ initData }) => ({
  currentUserAvatar: initData.currentUserAvatar,
  currentAccountID: initData.currentAccountID,
  currentUserFullname: initData.currentUserFullname,
  currentUserName: initData.currentUserName,
  currentUserEmail: initData.currentUserEmail,
  isVerify: initData.isVerify,
});


const mapDispatchToProps = dispatch => ({
   ...bindActionCreators(setNewAvatar, dispatch),
   ...bindActionCreators(setNewEmail, dispatch),
   ...bindActionCreators(setNewUsername, dispatch),
   ...bindActionCreators(setNewFullname, dispatch),
   ...bindActionCreators(setInitialData, dispatch),
   ...bindActionCreators(setPreload, dispatch),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
