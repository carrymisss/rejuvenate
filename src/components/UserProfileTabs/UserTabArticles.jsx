import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Col, Row, Card, Divider, Tag } from 'antd';


const ArticleRow = ({ el, username }) => {
	let htmlText;
	if (el.content.length > 500 ) {
		htmlText = el.content.substring(0, 500)+'&hellip;';
	} else {
		htmlText = el.content.substring(0, 500);
	}

	return (
		<>
		<Col span={24}>
			<Card className="c-article">
				<h3 style={{ display: "flex", alignItems: "center" }}>
					{ el.state === 'private' && <Tag style={{ height: "21px" }}>Приватна</Tag> }
					<Link to={`/${username}/view/${el.id}`} style={{ fontSize: "1.4875rem", wordBreak: "break-all", maxWidth: "98%" }}>{el.title}</Link>
				</h3>
				<time style={{ color: "#6c757d", marginTop: "5px", display: "block" }}>{el.published_at}</time>
				<div style={{ margin: "0", marginTop: "10px", marginBottom: "-1em", wordBreak: "break-all" }} dangerouslySetInnerHTML={{__html: htmlText}}></div>
			</Card>
			<Divider style={{ margin: "12px 0 0", borderTop: "1px solid rgba(0, 0, 0, 0.125)" }} />
		</Col>
		</>
	)
}

const UserTabArticles = ({ userArticles }) => {
	const { username } = useParams();

	return (
		<>
		<div style={{ width: "100%", minHeight: "460px" }}>
			<Row gutter={0} style={{ width: "100%" }}>
				<Divider style={{ margin: "12px 0 0", borderTop: "1px solid rgba(0, 0, 0, 0.125)" }} />
				{ userArticles.map(el =>
					<ArticleRow key={Math.random() * (2147483647 - (-2147483647)) + 2147483647} el={el} username={username} />
				)}
			</Row>
		</div>
		</>
	)
}

export default UserTabArticles;
