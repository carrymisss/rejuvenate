import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, PageHeader, Divider, Breadcrumb, Modal, message, Spin } from 'antd';
import { Edit, Lock, Unlock, Trash2, ChevronRight, Maximize, Minimize } from 'react-feather';
import { Link, useParams, useHistory } from "react-router-dom";
// import { BookmarkPlus, BookmarkDash } from 'react-bootstrap-icons';
import Error404 from './Error404';
import axios from 'axios';

const PrivateBadge = () => {
	return(
		<span className="c-badge-private">Приватна</span>
	)
}

const ViewArticle = ({ currentUserName, isUserLogin, appStatus, setAppStatus, setPreload }) => {
	const [title, setTitle] = useState('');
	const [slug, setSlug] = useState('');
	const [authorFullname, setAuthorFullname] = useState('');
	// const [authorID, setAuthorID] = useState('');
	const [authorUsername, setAuthorUsername] = useState('');
	const [date, setDate] = useState('');
	const [content, setContent] = useState('');
	const [type, setType] = useState('public');
	// const [isMarked, setIsMarked] = useState(null);
	const [loadStatus, setButonsStatus] = useState(true);
	const [fullscreenMode, setFullscreenMode] = useState(false);
	const [modalPrivate, setModalPrivate] = useState(false);
	const [modalDelete, setModalDelete] = useState(false);
	const [ignoreFetch, setIgnoreFetch] = useState(true);
	const [componentReady, setComponentReady] = useState(false);

	const { articleID } = useParams();
	const history = useHistory();

	useEffect(() => {
		setPreload(true);
		if (!ignoreFetch && articleID) {
			axios.post('/api/post/view', {id: articleID}).then(({ data }) => {
				if (data.statusCode === 200) {
					setAppStatus(200);
					// setAuthorID(data.user_id);
					setAuthorUsername(data.username);
					setTitle(data.title);
					setContent(data.text);
					setType(data.state);
					setAuthorFullname(data.autor_fullname);
					setSlug(data.slug);
					setDate(data.date);
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
				setPreload(false);
				message.error('Сталася помилка! Спробуйте ще раз.');
			});
		}
		return setIgnoreFetch(false);
	}, [ignoreFetch, articleID, setAppStatus, setPreload]);

	const showModalPrivate = () => { setModalPrivate(true); }

	const hideModalPrivate = () => { setModalPrivate(false); }

	const confirmModalPrivate = () => {
		setButonsStatus(false);
		axios.post('/api/post/changearticletype', {id: articleID, type: type === 'public' ? 'private' : 'public'}).then(({ data }) => {
			if (data.statusCode === 200) {
				setModalPrivate(false);
				type === 'public' ? setType('private') : setType('public');
				message.success('Тип статті успішно змінено!');
				setButonsStatus(true);
			} else {
				setButonsStatus(true);
				message.error('Сталася помилка! Спробуйте ще раз.');
			}
		}).catch(() => {
			setButonsStatus(true);
			message.error('Сталася помилка! Спробуйте ще раз.');
		})
	}

	const showModalDelete = () => { setModalDelete(true); }

	const hideModalDelete = () => { setModalDelete(false) }

	const confirmModalDelete = () => {
		setButonsStatus(false);
		axios.post('/api/post/delete', {id: articleID}).then(({ data }) => {
			if (data.statusCode === 200) {
				setModalDelete(false);
				setButonsStatus(true);
				message.success('Статтю видалено!');
				history.push('/');
			} else {
				setButonsStatus(true);
				message.error('Сталася помилка! Спробуйте ще раз.');
			}
		}).catch(() => {
			setButonsStatus(true);
			message.error('Сталася помилка! Спробуйте ще раз.');
		})
	}

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			setFullscreenMode(true);
			document.documentElement.requestFullscreen();
		} else {
			setFullscreenMode(false);
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	}

	// const onChangeMarked = () => {
	// 	setIsMarked(!isMarked);
	// }

	return (
		<>
		{ componentReady &&
			appStatus === 200
			? <>
				<div style={{ backgroundColor: "rgb(250, 250, 250)", marginTop: "15px", borderBottom: "1px solid #dee2e6" }}>
					<div className="o-wrapper o-container">
						<Row justify="space-between" gutter={[30, 30]} style={{  marginBottom: "0" }} className="c-bc__nw">
							<Col style={{ display: "flex", alignItems: "center" }}>
								<Breadcrumb separator={<ChevronRight size={20} />} style={{ fontSize: "1.1rem" }}>
									<Breadcrumb.Item>
										{ type === 'private' &&
											<span style={{ display: "inline-flex", alignContent: "center", marginRight: "5px", height: "23.27px" }} >
												<svg style={{ alignSelf: "center" }} viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill="rgba(0, 0, 0, 0.45)" fillRule="evenodd" d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z"></path></svg>
											</span>
										}
										<Link to={`/${authorUsername}`}>{ authorUsername }</Link>
									</Breadcrumb.Item>
									<Breadcrumb.Item>
										<Link to={`/${authorUsername}?tab=articles`}>Всі статті</Link>
									</Breadcrumb.Item>
									<Breadcrumb.Item>Перегляд</Breadcrumb.Item>
									<Breadcrumb.Item style={{ display: "inline-flex", alignItems: "center" }}>
										{ slug }
										{ type === 'private' &&
											<>&emsp;<PrivateBadge /></>
										}
									</Breadcrumb.Item>
								</Breadcrumb>
							</Col>
							<Col>
								{ (currentUserName === authorUsername && isUserLogin)
									? <div className="c-controls-buttons">
											<Spin size="small" spinning={ !loadStatus }>
												<Button type="link" className="c-article-controls__button" onClick={showModalPrivate}>
													{ type === 'public' ? <Lock size={24} /> : <Unlock size={24} /> }
												</Button>
											</Spin>
											<Spin size="small" spinning={ !loadStatus }>
												<Link to={`/${authorUsername}/edit/${articleID}`} className="c-article-controls__button"><Edit size={24} /></Link>
											</Spin>
											<Spin size="small" spinning={ !loadStatus }>
												<Button type="link" className="c-article-controls__button" onClick={toggleFullscreen}>
													{ fullscreenMode ? <Minimize size={24} /> : <Maximize size={24} /> }
												</Button>
											</Spin>
											<Spin size="small" spinning={ !loadStatus }>
												<Button type="link" className="c-article-controls__button c-article-controls__button_delete" onClick={showModalDelete}><Trash2 size={24} /></Button>
											</Spin>
										</div>
									: <div className="c-controls-buttons">
											<Button type="link" className="c-article-controls__button"><Maximize size={24} /></Button>
										</div>
								}
							</Col>
						</Row>
					</div>
				</div>

				<div className="o-container o-wrapper">
					<Row style={{ marginTop: "30px", paddingBottom: "30px" }} justify="center" gutter={30}>
						<Col span={24}>
							<Card>
								<PageHeader
									className="site-page-header"
									title={<span style={{ fontSize: "2rem", fontWeight: "500", wordBreak: "break-word", whiteSpace: "initial" }}>{ title }</span>}
									subTitle=""
									footer={
										<>
										<p className="c-author-info">
											<span className="c-author-pointer">Автор: </span>
											<Link to={`/${authorUsername}`} className="author-name">{ authorFullname > 0 ? authorFullname : authorUsername }</Link>
										</p>
										<time className="c-article-time">{ date }</time>
										<Divider style={{ borderColor: "rgb(222, 226, 230)" }} />
										</>
									}
								/>
							<section className="c-article-text_full" dangerouslySetInnerHTML={{__html: content}}></section>
							</Card>
						</Col>
					</Row>
				</div>
				<Modal
					title={ type === 'public' ? "Зробити цю статтю приватною?" : "Зробити цю статтю публічною?" }
					visible={modalPrivate}
					onOk={hideModalPrivate}
					onCancel={hideModalPrivate}
					footer={null}
					closeIcon={<span className="c-modal-close"></span>} >
					<div style={{ display: "flex", justifyContent: "space-around" }}>
						<Button type="ghost" style={{ backgroundColor: "#D0D3D4" }} onClick={hideModalPrivate}>
							<span style={{ fontWeight: "700" }}>Ні, я передумав</span>
						</Button>
						<Button type="primary" onClick={confirmModalPrivate}>
							<span style={{ fontWeight: "700" }}>Так, зробити</span>
						</Button>
					</div>
				</Modal>

				<Modal
					title="Видалити статтю?"
					visible={modalDelete}
					onOk={hideModalDelete}
					onCancel={hideModalDelete}
					footer={null}
					closeIcon={<span className="c-modal-close"></span>} >
					<div style={{ display: "flex", justifyContent: "space-around" }}>
						<Button type="ghost" style={{ backgroundColor: "#D0D3D4" }} onClick={hideModalDelete}>
							<span style={{ fontWeight: "700" }}>Ні, я передумав</span>
						</Button>
						<Button type="danger" onClick={confirmModalDelete}>
							<span style={{ fontWeight: "700" }}>Так, видалити</span>
						</Button>
					</div>
				</Modal>
				</>
			: componentReady && <Error404 />
		}
		</>
	)
}
// TODO: фуллскрін мод
// TODO: scale
export default ViewArticle
