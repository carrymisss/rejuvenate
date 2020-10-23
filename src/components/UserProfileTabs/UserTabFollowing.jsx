import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Row, Divider, Avatar, Card, Button, message } from 'antd';
import axios from 'axios';


const UserRow = ({ el, isUserLogin, currentUserName, username }) => {
	const [userFollow, setUserFollow] = useState(el.isUserFollowing);
	const [buttonLoad, setButtonLoad] = useState(false);

	const toggleFollow = () => {
		setButtonLoad(true);
		axios.post('/api/user/userfollowing', {user_id: el.id}).then(({ data }) => {
			setUserFollow(!userFollow);
			setButtonLoad(false);
		}).catch(() => {
			setButtonLoad(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		});
	}

	return (
		<>
		<Col span={24}>
			<Card className="c-user-pane">
				<div className="c-user-pane__content">
					<div className="c-user-pane__info">
						<Avatar size={40} src={el.avatar} />
						<div className="c-user-pane__name">
							<Link to={`/${el.username}`} className="c-user-pane__nickname"  style={{ fontSize: "1.3rem" }}>{el.username}</Link>
							<h6 style={{ fontWeight: "300", fontSize: "0.85rem" }}>{el.fullname}</h6>
						</div>
					</div>
					{ isUserLogin &&
						(currentUserName !== el.username &&
							<Button loading={buttonLoad} type={ userFollow ? 'ghost' : 'primary' } onClick={toggleFollow} size="middle" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
								{ userFollow ? 'Відстежується' : 'Стежити' }
							</Button>
						)
					}
				</div>
			</Card>
			<Divider style={{ margin: "0", borderTop: "1px solid rgba(0, 0, 0, 0.125)"}} />
		</Col>
		</>
	)
}

const UserTabFollowing = ({ userFollowing, currentUserName, isUserLogin }) => {
	let { username } = useParams();

	return (
		<>
		<div style={{ width: "100%", minHeight: "460px" }}>
			<Row gutter={0} style={{ width: "100%" }}>
				<Divider style={{ margin: "12px 0 0", borderTop: "1px solid rgba(0, 0, 0, 0.125)" }} />
				{ userFollowing.map(el =>
					<UserRow key={Math.random() * (2147483647 - (-2147483647)) + 2147483647} el={el} isUserLogin={isUserLogin} currentUserName={currentUserName} username={username} />
				) }
			</Row>
		</div>
		</>
	)
}

export default UserTabFollowing;
