import React, { useState, useEffect } from 'react';
import { Lock, Unlock, File } from 'react-feather';
import { Card, Col, Row, Form, Input, Button, Radio, Spin, message } from 'antd';
import { slugify } from 'transliteration';
import 'react-froala-wysiwyg/node_modules/froala-editor/css/froala_style.min.css';
import 'react-froala-wysiwyg/node_modules/froala-editor/css/froala_editor.pkgd.min.css';
import 'react-froala-wysiwyg/node_modules/froala-editor/js/froala_editor.pkgd.min.js';
import 'react-froala-wysiwyg/node_modules/froala-editor/js/languages/uk.js';
import 'react-froala-wysiwyg/node_modules/froala-editor/js/plugins.pkgd.min.js';
import 'react-froala-wysiwyg/node_modules/froala-editor/js/froala_editor.min.js';
import FroalaEditor from 'react-froala-wysiwyg';
import { ShieldLockFill, ShieldSlashFill } from 'react-bootstrap-icons';
import { useHistory, useParams } from "react-router-dom";
import CustomPrompt from './CustomPrompt'
import Error404 from './Error404';
import axios from 'axios';

const layout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 4 },
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 20 },
	},
};
const tailLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 20,
			offset: 4,
		},
	},
};

const froalaConfig = {
		heightMin: 100,
		language: 'uk',
		toolbarButtons: {
		'moreText': {
				'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
			},
			'moreParagraph': {
				'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
			},
			'moreRich': {
				'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
			},
			'moreMisc': {
				'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
				'align': 'right',
				'buttonsVisible': 2
			}
		}
	};

const EditArticle = ({ appStatus, setAppStatus, setPreload }) => {
	const [slug, setSlug] = useState('');
	const [realSlug, setRealSlug] = useState('');
	const [lockSlug, setLockSlug] = useState(true);
	const [editorText, setEditorText] = useState('');
	const [readyEditor, setReadyEditor] = useState(false);
	const [loadStatus, setLoadStatus] = useState(false);
	const [articleType, setArticleType] = useState('public');
	const [ignoreFetch, setIgnoreFetch] = useState(true);
	// const [pageLoading, setPageLoading] = useState(true);
	const [componentReady, setComponentReady] = useState(false);
	const [leaveIsBlocking, setLeaveIsBlocking] = useState(false);

	const [form] = Form.useForm();

	const { articleID, nickname } = useParams();

	const history = useHistory();

	useEffect(() => {
		setPreload(true);
		if (!ignoreFetch && articleID) {
			axios.post('/api/post/view', {id: articleID}).then(({ data }) => {
				if (data.statusCode === 200) {
					setSlug(data.title);
					setRealSlug(data.slug);
					setEditorText(data.text);
					setArticleType(data.state);
					setTimeout(() => {
						setComponentReady(true);
						setPreload(false);
					}, 500);
				} else {
					setTimeout(() => {
						setAppStatus(404);
						setComponentReady(true);
						setPreload(false);
					}, 500);
				}
     	 	}).catch(() => {
				message.error('Сталася помилка! Спробуйте ще раз.');
			});
		}
		return setIgnoreFetch(false);
	}, [ignoreFetch, form, articleID, setAppStatus, setPreload]);

	const onSlugChange = e => {
		const newStr = slugify(e.target.value, { lowercase: true, separator: '-' });
		setSlug(newStr);
		if (lockSlug) {
			setRealSlug(newStr);
			form.setFieldsValue({ slug: newStr });
		}
	}

	const onRealSlugChange = e => {
		setRealSlug(e.target.value);
		form.setFieldsValue({ slug: e.target.value });
   }

	const onLockToggle = () => {
		document.getElementById('edit_article_slug').blur();
		setLockSlug(!lockSlug);
		if (slug.length) {
			setRealSlug(slug);
			form.setFieldsValue({ slug: slug });
		}
	}

	const onEditorReady = initControls => {
		initControls.initialize();
		setTimeout(() => {
			setReadyEditor(true);
			setLoadStatus(true);
		}, 300);
	}

	const onEditorChange = txt => {
		setEditorText(txt);
		form.setFieldsValue({ text: txt });
	}

	const onChangeArticleType = e => {
		form.setFieldsValue({ type: e.target.value })
	}

	const onReset = () => {
		setLeaveIsBlocking(true);
		setReadyEditor(false);
		setLoadStatus(false);
		form.resetFields();
		setSlug('');
		setRealSlug('');
		setEditorText('');
		setArticleType('public');
		form.setFieldsValue({ slug: '', title: '', text: '', type: 'public' });
	};

	const onFinish = values => {
		setLeaveIsBlocking(false);
		setLoadStatus(false);
		axios.post('/api/post/editarticle', Object.assign(values, {id: articleID})).then(({ data }) => {
			if (data.statusCode === 200) {
				// history.push(`/${}/view/${articleID}`);
				message.success('Статтю успішно оновлено!', .4);
				setTimeout(() => {
					setLoadStatus(true);
					history.push(`/${nickname}/view/${articleID}`);
				}, 420);
			} else {
				setLoadStatus(true);
				message.error('Сталася помилка! Спробуйте ще раз.');
			}
		}).catch(() => {
			setLoadStatus(true);
			message.error('Сталася помилка! Спробуйте ще раз.');
		});
	};

   return (
		<>
		{ componentReady &&
			appStatus === 200
				? <>
					<CustomPrompt when={leaveIsBlocking} navigate={path => { history.push(path) }} shouldBlockNavigation={ location => { if (leaveIsBlocking) { return true } return false }} yes="Так" no="Ні" title="Покинути сторінку?" content="Внесені зміни, можливо, не буде збережено." />
				  	<div className="o-container o-wrapper">
					  	<Row style={{ marginTop: "30px", paddingBottom: "30px" }} justify="center" gutter={30}>
						  	<Col span={24} lg={20}>
							  	<Card type="inner" title={<span style={{ fontSize: "1.7rem" }}>Редагування</span>} extra={<File size={30} />}>
								  	<Form form={form} autoComplete="off" {...layout} name="edit_article"  initialValues={{ title: slug, slug: realSlug, text: editorText, type: articleType }} onFinish={onFinish} size="middle" onFieldsChange={() => setLeaveIsBlocking(true)} >
									  	<Form.Item label={ <span style={{ fontSize: "1.15rem", fontWeight: "600" }}>Заголовок</span> } name="title" rules={[{ required: true, min: 0, message: 'Введіть заголовок!' }]} onChange={onSlugChange}>
										  	<Input allowClear disabled={!loadStatus} />
									  	</Form.Item>

									  	<Form.Item label={<span style={{ fontSize: "1.15rem", fontWeight: "600" }}>Слаг</span>} rules={[ { required: !lockSlug, message: 'Введіть слаг!' }, { pattern: /^([0-9a-z-]){1,}(?<![-])$/, message: 'Введіть правильний слаг!' }, ]} name="slug">
										  	<Input value={realSlug} suffix={ lockSlug ? <Lock size={20} onClick={onLockToggle} /> : <Unlock size={20} onClick={onLockToggle} /> } onChange={ lockSlug ? onSlugChange : onRealSlugChange } disabled={ lockSlug ? true : false } />
									  	</Form.Item>

										<Form.Item label={<span style={{ fontSize: "1.15rem", fontWeight: "600" }}>Тип</span>} name="type" onChange={onChangeArticleType}  value={articleType}>
											<Radio.Group >
												<Radio value="public" disabled={!loadStatus}><ShieldSlashFill />&nbsp;Публічна</Radio>
												<Radio value="private" disabled={!loadStatus}><ShieldLockFill />&nbsp;Приватна</Radio>
											</Radio.Group>
										</Form.Item>

										<Form.Item label={<span style={{ fontSize: "1.15rem", fontWeight: "600" }}>Текст</span>} rules={[{ required: true, message: 'Введіть текст!' }]} name="text">
											<div style={{ minHeight: "190px", display: "flex", justifyContent: "center", alignItems: "center" }}>
												<Spin spinning={!readyEditor && !loadStatus} size="large" style={{ width: "100%" }}>
													<FroalaEditor onManualControllerReady={onEditorReady} onModelChange={onEditorChange} model={editorText} config={froalaConfig} />
												</Spin>
											</div>
										</Form.Item>

									  	<Form.Item {...tailLayout}>
										  	<Row justify="space-between">
											  	<Col>
												  	<Button type="danger" htmlType="button" onClick={onReset} loading={!loadStatus}>Очистити</Button>
											  	</Col>
											  	<Col>
											  		<Button type="ghost" className="c-btn__green" htmlType="submit" loading={!loadStatus}>Оновити статтю</Button>
											  	</Col>
										  	</Row>
									  	</Form.Item>
								  	</Form>
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

export default EditArticle;
