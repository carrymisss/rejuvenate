import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Animate from 'rc-animate';
import axios from 'axios';

import HeaderNotRegister from './HeaderNotRegister';
import HeaderIsRegister from '../containers/HeaderIsRegister';
import HeaderSimple from './HeaderSimple';
import Main from './Main';
// import Bookmarks from '../containers/Bookmarks';
import SignUp from '../containers/SignUp';
import SignIn from '../containers/SignIn';
import Settings from '../containers/Settings';
import CreateArticle from '../containers/CreateArticle';
import EditArticle from '../containers/EditArticle';
import ViewArticle from '../containers/ViewArticle';
import UserProfile from '../containers/UserProfile';
import Error404 from './Error404';
// import Error403 from './Error403';
import PreLoader from './PreLoader';


class App extends React.Component {
   componentDidMount() {
      const { setInitialData, setPreload } = this.props;
      axios.post('/api/user/initial').then(({ data }) => {
         if (data) {
            setInitialData(data);
            setPreload(false);
         } else {
            setPreload(false);
            message.error('Сталася помилка! Спробуйте ще раз.');
         }
      }).catch(() => {
         setPreload(false);
         message.error('Сталася помилка! Спробуйте ще раз.');
      });
   }

   render() {
      const { isUserLogin, isPreLoading } = this.props;
      return (
         <>
            <Animate transitionName="fade">
               { isPreLoading && <PreLoader /> }
            </Animate>
            <>
            <Router>
               <Switch>
                  <Route exact path="/login">
                     <HeaderSimple />
                  </Route>
                  <Route exact path="/join">
                     <HeaderSimple />
                  </Route>
                  <Route path="*">
                     { isUserLogin ? <HeaderIsRegister /> : <HeaderNotRegister /> }
                  </Route>
               </Switch>

               <Scrollbars autoHide universal={true} autoHideTimeout={800} autoHideDuration={280} renderTrackVertical={()=>{return(<div className="c-scroll__track"></div>)}} renderThumbVertical={()=>{return(<div className="c-scroll__thumb"></div>)}} style={{ width: "100%", height: "calc(100vh - 51px" }}>
                  <Switch>
                     <Route exact path="/">
                        <Main />
                     </Route>
                     <Route exact path="/bookmarks">
                        <Redirect to="/" />
                     </Route>
                     <Route exact path="/settings">
                        { isUserLogin !== null && (isUserLogin ? <Settings  /> : <Redirect to="/login" />) }
                     </Route>
                     <Route exact path="/login">
                        { isUserLogin !== null && (isUserLogin ? <Redirect to="/" /> : <SignIn />) }
                     </Route>
                     <Route exact path="/join">
                        { isUserLogin !== null && (isUserLogin ? <Redirect to="/" /> : <SignUp />) }
                     </Route>
                     <Route exact path="/:username">
                        <UserProfile />
                     </Route>
                     <Route exact path="/:username/create">
                        { isUserLogin !== null && (isUserLogin ? <CreateArticle  /> : <Redirect to="/login" />) }
                     </Route>
                     <Route exact path="/:username/view/:articleID">
                        <ViewArticle />
                     </Route>
                     <Route exact path="/:username/edit/:articleID">
                        { isUserLogin !== null && (isUserLogin ? <EditArticle  /> : <Redirect to="/login" />) }
                     </Route>
                     <Route path="*">
                        <Error404 />
                     </Route>
                  </Switch>
               </Scrollbars>
            </Router>
            </>
         </>
      );
   }
}

export default App;
