import { connect } from 'react-redux';
import UserProfileTabs from '../components/UserProfileTabs';

const mapStateToProps = ({ initData }) => ({
  currentUserName: initData.currentUserName,
  isUserLogin: initData.isUserLogin,
  currentAccountID: initData.currentAccountID,
});

export default connect(
  mapStateToProps,
  null
)(UserProfileTabs);
