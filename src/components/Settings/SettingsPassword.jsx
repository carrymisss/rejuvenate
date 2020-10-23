import React, { useState } from 'react';
import { Form, Col, Row, Input, message, Button, Card } from 'antd';
import axios from 'axios';


const layout = {
	labelCol: { span: 3 },
	wrapperCol: { span: 10 },
};

const layout3 = {
	labelCol: { span: 24 },
	wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { offset: 0, span: 24 },
};

const SettingsPassword = () => {
	const [isBlocked, setIsBlocked] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [isPassReq, setIsPassReq] = useState(false);
	const [isFormChanges, setIsFormChanges] = useState(false);

	const [form] = Form.useForm();

	const passReq = (e) => {
		if (e.target.value) {
			setIsPassReq(true);

		} else {
			setIsPassReq(false);
			setIsFormChanges(false);
			form.resetFields();
		}
	}

	const onFinish = values => {
		setIsBlocked(true);
		axios.post('/api/user/settingspassword', values).then(({ data }) => {
			setIsBlocked(false);
			if (data.statusCode === 200) {
				setIsBlocked(false);
				form.resetFields();
				setIsFormChanges(false);
				message.success('Пароль оновлено!');
			} else {
				setIsBlocked(false);
				form.setFieldsValue({ oldPassword: '' });
				setErrorPassword(true);
				message.error('Старий пароль не вірний!');
			}
		}).catch(() => {
			setIsBlocked(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		})
	};

	return (
		<>
		<Form {...layout} hideRequiredMark="false" layout="horizontal" form={form} name="settings_form_password" initialValues={{ oldPassword: '', newPassword: '' }} onFinish={onFinish} onValuesChange={() => {setIsFormChanges(true);setErrorPassword(false);}}>
			<h4 className="c-settings__title">Змінити пароль</h4>
			<Row gutter={30}>
				<Col span={24} md={16}>
					<p style={{ fontSize: "1.0625rem", marginBottom: "0.5rem", fontWeight: "500", lineHeight: "1.2" }}>Покращіть свій захист з надійним паролем.</p>
					<Card className="c-change-password-card">
						<Form.Item {...layout3} name="oldPassword" label={ <b>Старий пароль</b> } rules={[ {required: isPassReq, message: 'Поля зміни пароля не заповнені!'}, ]} hasFeedback className={ (errorPassword) && "ant-row ant-form-item ant-form-item-has-feedback ant-form-item-has-error" }>
							<Input.Password disabled={isBlocked} onChange={passReq} />
						</Form.Item>

						<Form.Item {...layout3} name="newPassword" label={ <b>Новий пароль</b> } rules={[ {required: isPassReq, message: 'Поля зміни пароля не заповнені!'}, {pattern: /^([0-9a-zA-Z]){6,20}$/, message: 'Має містити від 6 до 20 символів, які містять латинські літери будь-якого регістру і цифри.'} ]} hasFeedback>
							<Input.Password disabled={isBlocked} onChange={passReq} />
						</Form.Item>

						<Form.Item {...layout3} name="confirmNewPassword" label={ <b>Підтвердіть новий пароль</b> } dependencies={['newPassword']} rules={[ {required: isPassReq, message: 'Підтвердіть новий пароль!'}, ({ getFieldValue }) => ({ validator(rule, value) { if (!value || getFieldValue('newPassword') === value) { return Promise.resolve() } return Promise.reject('Паролі не співпадають!') }, }), ]} hasFeedback>
							<Input.Password disabled={isBlocked} />
						</Form.Item>

						<Form.Item {...tailLayout}>
							<Button type="ghost" size="middle" className="c-btn__green" htmlType="submit" disabled={!isFormChanges || isBlocked}>Оновити пароль</Button>
						</Form.Item>

						<p>Впевніться, що пароль містить від 6 до 20 символів, які містять латинські літери будь-якого регістру і цифри. <span style={{ textDecoration: "underline" }}>Будь-які інші символи заборонені</span>.</p>
					</Card>
				</Col>
			</Row>
		</Form>
		</>
	)
}

export default SettingsPassword
