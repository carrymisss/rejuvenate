import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Avatar, Button, Card, message, Spin } from 'antd';
import { Link, useParams, useLocation } from "react-router-dom";
import UserProfileTabs from '../containers/UserProfileTabs';
// import { BookmarkPlus, BookmarkDash } from 'react-bootstrap-icons';
import Error404 from './Error404';
import axios from 'axios';

const UserProfile = ({ isUserLogin, currentUserName, appStatus, setPreload, setAppStatus }) => {
	const { username } = useParams();

	const [userName, setUserName] = useState(username);
	const [userFullaname, setUserFullname] = useState('');
	const [userAvatar, setUserAvatar] = useState('');
	const [userPins, setUserPins] = useState([]);
	const [accountID, setAccountID] = useState('');
	const [userArticles, setUserArticles] = useState([]);
	const [userFollowing, setUserFollowing] = useState([]);
	const [userFollowers, setUserFollowers] = useState([]);
	const [isUserFollowing, setIsUserFollowing] = useState(false);
	// const [isUserMarked, setIsUserMarked] = useState('false');
	const [buttonFollowLoad, setButtonFollowLoad] = useState(false);
	// const [buttonBMLoad, setButtonBMLoad] = useState(false);
	// const [ignoreFetch, setIgnoreFetch] = useState(true);
	const [componentReady, setComponentReady] = useState(false);

	let location = useLocation();

	useEffect(() => {
		setPreload(true);
		setTimeout(() => {
			setComponentReady(false);
			axios.post('/api/user/userpage', {user_name: location.pathname.replace('/', '')}).then(({ data }) => {
				if (data.statusCode === 200) {
					setUserName(data.userUsername);
					setUserFullname(data.userFullname);
					setUserAvatar(data.userAvatar);
					setAccountID(data.accountID);
					setUserPins(data.userPins);
					setIsUserFollowing(data.isUserFollowing);
					setUserArticles(data.userArticles);
					setUserFollowing(data.userFollowing);
					setUserFollowers(data.userFollowers);
					setTimeout(() => {
						setComponentReady(true);
						setPreload(false);
					}, 200);
				} else {
					setTimeout(() => {
						setAppStatus(404);
						setComponentReady(true);
						setPreload(false);
					}, 200);
				}
			}).catch(() => {
				message.error('Сталася помилка! Спробуйте ще раз.');
			});
		}, 200);
	}, [location.pathname, setAppStatus, setPreload]);

	const onChangeFollowing = () => {
		setButtonFollowLoad(true);
		axios.post('/api/user/userfollowing', {user_id: accountID}).then(({ data }) => {
			setIsUserFollowing(!isUserFollowing);
			setButtonFollowLoad(false);
		}).catch((reject) => {
			setButtonFollowLoad(false);
			message.error('Сталася помилка! Спробуйте ще раз.'+reject);
		});
	}

	// const onChangeMarked = () => {
	// 	setIsUserMarked(!isUserMarked);
	// }

	return (
		<>
		{ componentReady &&
			appStatus === 200
			? <>
				<div className="o-container o-wrapper" style={{ paddingBottom: "30px" }}>
					<Row style={{ marginTop: "30px" }} gutter={16}>
						<Col span={24} md={9} lg={7} xl={6} style={{ marginBottom: "15px" }}>
							<Row justify="content">
								<Col span={24} md={23} lg={22} >
									<div className="c-profile__card">
										<Card>
											<Space direction="vertical" size="middle" style={{ width: "100%" }}>
												<Link to="#" style={{ display: "flex", justifyContent: "center" }}>
													<Avatar src={userAvatar} shape="square" size={200} className="c-profile__avatar" />
												</Link>
													<Space direction="vertical" size="large" style={{ width: "100%" }}>
														<div>
															<h2 className="c-user-title">{ userName }</h2>
															<h5 className="c-user-title__name">{ userFullaname }</h5>
														</div>
														{ isUserLogin &&
															(currentUserName === userName ?
																<Link to="/settings"><Button type="ghost" style={{ backgroundColor: "#D0D3D4" }} block>Редагувати</Button></Link>
															: <Space className="c-snw">
																<Spin spinning={buttonFollowLoad}>
																	<Button type="ghost" style={{ backgroundColor: "#D0D3D4" }} block onClick={onChangeFollowing}>
																		{ !isUserFollowing ? 'Стежити' : 'Не стежити' }
																	</Button>
																</Spin>
																{/*<Spin spinning={buttonBMLoad}>
																	<Button type="primary" onClick={onChangeMarked}>
																		{ isUserMarked ? <BookmarkPlus size={18} /> : <BookmarkDash size={18} /> }
																	</Button>
																</Spin>*/}
															  </Space>
															)
														}
													</Space>
											</Space>
										</Card>
									</div>
								</Col>
							</Row>
						</Col>
						<Col span={24} md={15} lg={17} xl={18}>
							<Card>
								<UserProfileTabs userPins={userPins} userArticles={userArticles} userFollowing={userFollowing} userFollowers={userFollowers} />
							</Card>
						</Col>
					</Row>
				</div>
				</>
			: componentReady && <Error404 />
		}
		</>
	)
}

export default UserProfile;
