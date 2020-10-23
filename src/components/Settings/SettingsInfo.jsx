import React, { useState, useEffect } from 'react';
import { Form, Input, message, Button } from 'antd';
import axios from 'axios';


const layout = {
	labelCol: { span: 3 },
	wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 3, span: 21 },
};

const SettingsInfo = ({ currentUserName, currentUserFullname, setInitialData, setNewUsername, setNewFullname }) => {
	const [isBlocked, setIsBlocked] = useState(false);
	const [errorLogin, setErrorLogin] = useState(false);
	const [isFormChanges, setIsFormChanges] = useState(false);
	const [ignoreFetch, setIgnoreFetch] = useState(true);

	const [form] = Form.useForm();

	useEffect(() => {
		if (!ignoreFetch) {
			form.resetFields();
		}
		return setIgnoreFetch(false);
	}, [ignoreFetch, form, currentUserName, currentUserFullname]);

	const changesWatch = () => {
		if (form.getFieldsValue().fullname === currentUserFullname && form.getFieldsValue().username === currentUserName) {
			setIsFormChanges(false);
		} else {
			setErrorLogin(false);
			setIsFormChanges(true);
		}
	}

	const onFinish = values => {
		setIsBlocked(true);
		axios.post('/api/user/settingsinfo', values).then(({ data }) => {
			if (data.statusCode === 200) {
				message.success('Особисті дані успішно оновлено!');
				setNewUsername(values.username);
				setNewFullname(values.fullname);
				setIsBlocked(false);
				setIsFormChanges(false);
			} else {
				setIsBlocked(false);
				setErrorLogin(true);
				message.error('Нікнейм вже існує!');
			}
		}).catch(() => {
			setIsBlocked(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		})
	};

	return (
		<>
		<Form {...layout} hideRequiredMark="false" layout="horizontal" form={form} name="settings_form_info" initialValues={{ fullname: currentUserFullname, username: currentUserName }} onFinish={onFinish} onValuesChange={changesWatch}>
			<h4 className="c-settings__title">Особисті дані</h4>
			<Form.Item label={ <b>Ім&#39;я</b> } name="fullname" rules={[ { max: 20, message: "Має містити максимум 20 будь-яких символів." } ]} >
				<Input allowClear disabled={isBlocked} />
			</Form.Item>

			<Form.Item label={ <b>Нікнейм</b> } name="username" rules={[{ required: true, message: 'Будь-ласка введіть нікнейм!', whitespace: true }, {pattern: /^(?=[^-A-Z])[a-z0-9-_]{3,12}(?<![-])$/, message: 'Має містити від 3 до 12 символів, які складаються з латинських літер низького регістру, цифр та символів \'-\', \'_\'. Не може починатися та закінчуватися на \'-\'.'} ]} hasFeedback className={ (errorLogin) && "ant-row ant-form-item ant-form-item-has-feedback ant-form-item-has-error" }>
				<Input addonBefore="www.leaflet.com/" disabled={isBlocked} />
			</Form.Item>

			<Form.Item {...tailLayout}>
				<Button type="ghost" size="middle" className="c-btn__green" htmlType="submit" disabled={!isFormChanges || isBlocked}>Оновити особисті дані</Button>
			</Form.Item>
		</Form>
		</>
	)
}

export default SettingsInfo
