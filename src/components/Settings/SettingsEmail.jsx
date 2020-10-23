import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Input, message, Button, Alert, Badge } from 'antd';
import { ExclamationCircle, PatchCheck, Check, X } from 'react-bootstrap-icons';
import { Edit } from 'react-feather';
import axios from 'axios';


const layout = {
	labelCol: { span: 3 },
	wrapperCol: { span: 10 },
};

const layout2 = {
	labelCol: { span: 0 },
	wrapperCol: { span: 24 },
};

const SettingsEmail = ({ isVerify, currentUserEmail, setNewEmail }) => {
	const [isBlocked, setIsBlocked] = useState(false);
	const [showEInput, setShowEInput] = useState(false);
	const [ignoreFetch, setIgnoreFetch] = useState(true);

	const [form] = Form.useForm();

	useEffect(() => {
		if (!ignoreFetch) {
			form.resetFields();
		}
		return setIgnoreFetch(false);
	}, [ignoreFetch, form, currentUserEmail]);

	const toggleEmailInput = () => {
		setShowEInput(!showEInput);
		form.setFieldsValue({ email: currentUserEmail });
	}

	const sendEmail = () => {
		const key = 'email';
		message.loading({ content: 'Пишемо листа...', key });
		axios.post('/api/user/emailsend').then(({ data }) => {
			if (data.statusCode === 200) {
				message.info({ content: 'Лист з підтвердженням було відправлено вам на пошту. Перевірте її.', key, duration: 4 });
			} else {
				message.error({ content: 'Сталася помилка! Спробуйте ще раз.', key });
			}
		}).catch(() => {
			setIsBlocked(false);
			message.error({ content: 'Сталася помилка! Спробуйте ще раз.', key });
		})
	}

	const onFinish = values => {
		setIsBlocked(true);
		axios.post('/api/user/settingsemail', values).then(({ data }) => {
			if (data.statusCode === 200) {
				setIsBlocked(false);
				message.success('Ваш Email успішно оновлено!');
				setNewEmail(values.email);
				toggleEmailInput();
			} else {
				setIsBlocked(false);
				message.error('Сталася помилка! Спробуйте ще раз.');
			}
		}).catch(() => {
			setIsBlocked(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		})
	};

	return (
		<>
		<Form {...layout} hideRequiredMark="false" layout="horizontal" form={form} name="settings_form_email" initialValues={{ email: currentUserEmail }} onFinish={onFinish}>
			<h4 className="c-settings__title">Налаштування e-mail { !isVerify && <>&nbsp;<Badge status="processing" className="c-ctm-bdg" /></> }</h4>
			<Row gutter={30}>
				<Col span={24} md={15}>
					{ !showEInput &&
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<span className="c-current-email">{ currentUserEmail }</span>
							<Button type="link" onClick={toggleEmailInput} className="c-btn__input-prepend" disabled={isBlocked}><Edit size={20} /></Button>
						</div>
					}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", opacity: showEInput ? '1' : '0', position: showEInput ? 'unset' : 'absolute', left: showEInput ? null : '-9999px' }}>
						<Form.Item required={true} name="email" rules={[ { type: 'email', message: 'Введіть E-mail!', }, { required: true, message: 'Введіть E-mail!', }, ]} {...layout2} style={{ marginBottom: "0", width: "100%" }} hasFeedback>
							<Input allowClear style={{ width: "100%" }} disabled={isBlocked} />
						</Form.Item>
						<Button type="ghost" style={{ paddingLeft: "10px", paddingRight: "10px", marginLeft: "10px" }} htmlType="submit" disabled={isBlocked}>
							<Check size={16} />
						</Button>
						<Button type="ghost" style={{ backgroundColor: "#D0D3D4", marginLeft: "10px", paddingLeft: "10px", paddingRight: "10px" }} onClick={toggleEmailInput} disabled={isBlocked}>
							<X size={16} />
						</Button>
					</div>
				</Col>
				<Col span={24} md={9}>
					{ isVerify === true
						? <Alert message={
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", margin: "10px 0" }}>
									<PatchCheck size="34" />
									<p style={{ fontWeight: "700", fontSize: "1.2rem", margin: "5px 0 0" }}>Підтверджено.</p>
									<p style={{ fontSize: "1rem", marginBottom: "0" }}>
										Ви підтвердили свій e-mail.
									</p>
								</div>
							} type="success" />
						: <Alert message={
								<div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", margin: "10px 0" }}>
									<ExclamationCircle size="34" />
									<p style={{ fontWeight: "700", fontSize: "1.2rem", margin: "5px 0 0" }}>Не підтверджено.</p>
									<p style={{ fontSize: "1rem", marginBottom: "0" }}>
										<span style={{ color: "#782fef", background: "transparent", borderColor: "transparent", boxShadow: "none", border: "0", outline: "0", margin: "0", padding: "0", cursor: "pointer" }} onClick={sendEmail}>Підтвердіть</span> свій e-mail.
									</p>
								</div>
							} type="error" />
						}
				</Col>
			</Row>
		</Form>
		</>
	)
}

export default SettingsEmail;
