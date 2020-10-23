import React, { useCallback }  from 'react';
import { Col, Row, Badge, Tabs } from 'antd';
// import UserTabPins from './UserProfileTabs/UserTabPins';
import UserTabArticles from './UserProfileTabs/UserTabArticles';
import UserTabFollowers from './UserProfileTabs/UserTabFollowers';
import UserTabFollowing from './UserProfileTabs/UserTabFollowing';
import { Eye, People, Collection, House } from 'react-bootstrap-icons';//Grid
import { useLocation, useParams, useHistory } from "react-router-dom";

const {TabPane} = Tabs;

const EmptyTab = (props) => {
   const {sign, message} = props;
	return(
      <Row gutter={[30, 0]}>
         <Col span={24}>
            <div className="c-empty-sign">
               {sign}
               <span>{message}</span>
            </div>
         </Col>
      </Row>
   )
}

const UserProfileTabs = ({ userPins, userArticles, userFollowers, userFollowing, currentAccountID, isUserLogin, currentUserName }) => {
   const useQuery = () => {
      return new URLSearchParams(useLocation().search);
   }

   const { username } = useParams();

   const query = useQuery();

   const history = useHistory();

   const foundTab = useCallback(
      (tab) => {
        switch (tab) {
           case 'articles':
              return '2';
           case 'followers':
              return '3';
           case 'following':
              return '4';
           default:
              return '1';
         }
      },
      [],
   );

   const tabClick = (key) => {
      switch (key) {
         case '2':
            history.push(`/${username}?tab=articles`);
            break;
         case '3':
            history.push(`/${username}?tab=followers`);
            break;
         case '4':
            history.push(`/${username}?tab=following`);
            break;
         default:
            history.push(`/${username}`);
            break;
       }
   }



   const TabArticles = (
      <span style={{ "display": "inline-flex", "alignItems": "center" }}>Всі статті&nbsp;<Badge count={userArticles.length} overflowCount={10000} style={{ backgroundColor: "#ECF0F1", color: "#782fef" }} /></span>
   );
   const TabFollowers = (
      <span style={{ "display": "inline-flex", "alignItems": "center" }}>Читачі&nbsp;<Badge count={userFollowers.length} overflowCount={10000} style={{ backgroundColor: "#ECF0F1", color: "#782fef" }} /></span>
   );
   const TabFollowing = (
      <span style={{ "display": "inline-flex", "alignItems": "center" }}>Відстежуються&nbsp;<Badge count={userFollowing.length} overflowCount={10000} style={{ backgroundColor: "#ECF0F1", color: "#782fef" }} /></span>
   );

   // (userPins && userPins.length) ? <UserTabPins userPins={userPins} currentUserName={currentUserName} currentAccountID={currentAccountID} /> :

	return (
		<>
      <Tabs tabPosition="top" defaultActiveKey={ foundTab(query.get("tab")) } onTabClick={ tabClick }>
         <TabPane tab="Огляд" key="1" >
            { <EmptyTab  sign={<House size={80} />} message="" /> }
         </TabPane>
         <TabPane tab={TabArticles} key="2">
				{ (userArticles && userArticles.length) ? <UserTabArticles userArticles={userArticles} /> : <EmptyTab sign={<Collection size={80} />} message="Всі статті" /> }
			</TabPane>
			<TabPane tab={TabFollowers} key="3">
				{ (userFollowers && userFollowers.length) ? <UserTabFollowers userFollowers={userFollowers} isUserLogin={isUserLogin} currentUserName={currentUserName}  /> : <EmptyTab sign={<People size={80} />} message="Читачі" /> }
			</TabPane>
			<TabPane tab={TabFollowing} key="4">
				{ (userFollowing && userFollowing.length) ? <UserTabFollowing userFollowing={userFollowing} isUserLogin={isUserLogin} currentUserName={currentUserName} /> : <EmptyTab sign={<Eye size={80} />} message="Відстежуються" /> }
			</TabPane>
		</Tabs>
   	</>
	)
}

export default UserProfileTabs;
