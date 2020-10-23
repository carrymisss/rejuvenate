import React, { useState, useEffect } from 'react';
import { Bookmark } from 'react-feather';
import { Link } from 'react-router-dom';
import { People, Files } from 'react-bootstrap-icons';
import { Card, Col, Row, Button, Tabs, Badge, Divider, Avatar } from 'antd';

const {TabPane} = Tabs;

const EmptyTab = (props) => {
   const {sign, message} = props;
	return(
      <Row gutter={[30, 16]}>
         <Col span={24}>
            <div className="c-empty-sign">
               {sign}
               <span>{message}</span>
            </div>
         </Col>
      </Row>
   )
}

const Bookmarks = ({ currentUserID, isUserRegister }) => {
	const [articles, setArticles] = useState([
		{
			"title": "title",
			"date": "23:59:59, 2020-12-31",
			"content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas illo illum iste, et ab, maxime vero est tenetur perspiciatis, fuga architecto ut accusantium labore dolorem?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, pariatur sunt commodi explicabo! Voluptate officiis optio, magnam modi iure consequatur esse culpa nisi repellendus ipsa pariatur suscipit veniam, distinctio laborum alias tenetur explicabo libero nostrum doloremque possimus consequuntur quidem soluta!",
			"articleID": "article_id11",
			"type": "private",
			"authorID": "admin"
		},
		{
			"title": "title",
			"date": "23:59:59, 2020-12-31",
			"content": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas illo illum iste, et ab, maxime vero est tenetur perspiciatis, fuga architecto ut accusantium labore dolorem?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore, pariatur sunt commodi explicabo! Voluptate officiis optio, magnam modi iure consequatur esse culpa nisi repellendus ipsa pariatur suscipit veniam, distinctio laborum alias tenetur explicabo libero nostrum doloremque possimus consequuntur quidem soluta!",
			"articleID": "article_id22",
			"type": "public",
			"authorID": "admin"
		}
	]);
	const [users, setUsers] = useState([
		{
			"userAvatar": "user_avatar",
			"userNickname": "admin",
			"userFullname": "John Doe",
			"userID": "user_id1",
    	},
		{
			"userAvatar": "user_avatar",
			"userNickname": "admin",
			"userFullname": "John Doe",
			"userID": "user_id2",
    	},
	]);

	const deleteFromBookmarks = (type, id) => {
		console.log(type, '--', id);
	}

	return (
		<>
		<div className="o-container o-wrapper">
			<Row style={{ marginTop: "30px", paddingBottom: "30px" }} justify="center" gutter={30}>
				<Col span={24}>
					<Card type="inner" title={<span style={{ fontSize: "1.7rem" }}>Закладки</span>} extra={<Bookmark size={30} />}>
						<Tabs animated={{inkBar:true, tabPane:true}} tabPosition="top" defaultActiveKey="1">
						   <TabPane tab={<span style={{ "display": "inline-flex", "alignItems": "center" }}>Статті&nbsp;<Badge count={5} overflowCount={10000} style={{ backgroundColor: "#ECF0F1", color: "#782fef" }} /></span>} key="1">
					     		{ articles.length ? <Row>
									<Divider style={{ margin: "12px 0 0", borderTop: "1px solid rgba(0, 0, 0, 0.125)" }} />
									{ articles.map(el =>
										<Col span={24} key={el.articleID}>
											<Card className="c-article">
												<h3 style={{ display: "flex", alignContent: "center" }}>
													<Link to={`/${el.authorID}/view/${el.articleID}`} style={{ fontSize: "1.4875rem", wordBreak: "break-all", maxWidth: "96%" }}>{el.title} {el.articleID}</Link>
												</h3>
											   <time style={{ color: "#6c757d", marginTop: "5px", display: "block" }}>{el.date}</time>
												<p style={{ margin: "0", marginTop: "10px" }}>{el.content.substring(0, 500)}</p>
												{ isUserRegister && <button className="c-delete-from-bookmarks-btn c-delete-from-bookmarks-btn_articles" onClick={() => deleteFromBookmarks('article', el.articleID)}></button> }
											</Card>
											<Divider style={{ margin: "12px 0 0", borderTop: "1px solid rgba(0, 0, 0, 0.125)" }} />
										</Col>
									) }
								</Row> : <EmptyTab sign={<Files size={80} />} message="Articles" /> }
						  	</TabPane>
						   <TabPane tab={<span style={{ "display": "inline-flex", "alignItems": "center" }}>Користувачі&nbsp;<Badge count={5} overflowCount={10000} style={{ backgroundColor: "#ECF0F1", color: "#782fef" }} /></span>} key="2">
								{ users.length ? <Row>
									<Divider style={{ margin: "12px 0 0", borderTop: "1px solid rgba(0, 0, 0, 0.125)" }} />
									  { users.map(el =>
					  				<Col span={24} key={el.userID}>
					  					<Card className="c-user-pane">
					  						<div className="c-user-pane__content">
					  							<div className="c-user-pane__info">
					  								<Avatar size={40} src="/images/noavatar.png" />
					  								<div className="c-user-pane__name">
					  									<Link to="#" className="c-user-pane__nickname"  style={{ fontSize: "1.3rem" }}>{el.userNickname}</Link>
					  									<h6 style={{ fontWeight: "300", fontSize: "0.85rem" }}>{el.userFullname}</h6>
					  								</div>
					  							</div>
					  						</div>
											{ isUserRegister && <button className="c-delete-from-bookmarks-btn c-delete-from-bookmarks-btn_users" onClick={() => deleteFromBookmarks('user', el.userID)}></button> }
					  					</Card>
					  					<Divider style={{ margin: "0", borderTop: "1px solid rgba(0, 0, 0, 0.125)"}} />
					  				</Col>
									  ) }
								  </Row> : <EmptyTab sign={<People size={80} />} message="Users" /> }
						   </TabPane>
					  	</Tabs>
					</Card>
				</Col>
			</Row>
		</div>
		</>
	)
}

export default Bookmarks;
