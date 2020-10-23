import React, { useState, useEffect } from 'react';
import { Card, Col, Row, PageHeader, Divider, message, Spin } from 'antd';
import { Link } from "react-router-dom";
import QueueAnim from 'rc-queue-anim';
import axios from 'axios';


const Main = () => {
	const [allArticles, setAllArticles] = useState([]);
	const [ignoreFetch, setIgnoreFetch] = useState(true);

	useEffect(() => {
		if (!ignoreFetch) {
			axios.post('/api/post/index').then(({ data }) => {
				if (data.statusCode === 200) {
					setAllArticles(data.articles);
				} else {
					message.error('Сталася помилка! Спробуйте ще раз.');
				}
			}).catch(() => {
				message.error('Сталася помилка! Спробуйте ще раз.');
			});
		}
		return setIgnoreFetch(false);
	}, [ignoreFetch]);

	return (
		<>
			{
				allArticles.length
				? <>
					<div className="o-container o-wrapper">
						<Row style={{ marginTop: "30px", paddingBottom: "30px" }} justify="center" gutter={30}>
							<Col span={20}>
								<QueueAnim delay={300} className="queue-simple" style={{ width: "100%" }}>
									{
										allArticles.map((el) => {
											return (
												<Row style={{ marginTop: "0" }} justify="center" gutter={[30, 30]}  key={el.id}>
													<Col span={24}>
														<Card>
															<PageHeader
																className="site-page-header"
																title={<Link to={`/${el.username}/view/${el.id}`} style={{ fontSize: "1.4875rem", wordBreak: "break-all", maxWidth: "98%" }}>{el.title}</Link>}
																subTitle=""
																footer={
																	<>
																	<p className="c-author-info">
																		<span className="c-author-pointer">Автор: </span>
																		<Link to={`/${el.username}`} className="author-name">{ el.fullname > 0 ? el.fullname : el.username }</Link>
																	</p>
																	<time className="c-article-time">{el.date}</time>
																	<Divider style={{ borderColor: "rgb(222, 226, 230)" }} />
																	</>
																}
															/>
															<section className="c-article-text_full" dangerouslySetInnerHTML={{__html: el.content}}></section>
														</Card>
													</Col>
												</Row>
											)
							  			})
									}
								</QueueAnim>
							</Col>
						</Row>
					</div>
				</>
			: <div className="c-main"><Spin size="large" style={{ transform: "scale(1.5)" }} /></div>
			}
		</>
	)
}

export default Main;
