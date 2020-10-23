import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Col, Row, Space, message } from 'antd';
import { User, Lock } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({ setInitialData, setPreload }) => {
	const [errors, setErrors] = useState(false);
	const [loading, setLoading] = useState(false);
	const [change, setChange] = useState(false);

	let history = useHistory();

	const [form] = Form.useForm();

	const onFinish = values => {
		setLoading(true);
		axios.post('/api/user/login', values).then(({ data }) => {
			if (data.loginStatus === 200) {
				setPreload(true);
				setLoading(false);
				axios.post('/api/user/initial').then(({ data }) => {
					setTimeout(() => {
						setInitialData(data);
						history.push('/');
						setPreload(false);
		         }, 200);
		      });
			} else {
				setPreload(false);
				setLoading(false);
				setChange(false);
				setLoading(false);
				setErrors(true);
				message.error('Невірні дані!');
			}
      }).catch(() => {
			setPreload(false);
			setLoading(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		});
	};

	return (
	   <div className="o-container o-wrapper">
			<Row justify="center" gutter={30} style={{ margin : "0" }}>
				<Col span={24} md={16} lg={12} xl={9}>
					<Form form={form} name="sign_in_form" initialValues={{ remember: false }} onFinish={onFinish} className="c-form" onValuesChange={() => setChange(true)}>
						<Form.Item name="username" rules={[{ required: true, whitespace: true, message: 'Введіть логін!' }, {pattern: /^(?=[^-A-Z])(?=.*[a-z])[a-zA-Z0-9-_]{3,12}(?<![-])$/, message: 'Має містити від 3 до 12 символів, які складаються з латинських літер будь-якого регістру, цифр та символів \'-\', \'_\'. Не може починатися та закінчуватися на \'-\'.'} ]} hasFeedback className={ (errors && !change) && "ant-row ant-form-item ant-form-item-has-feedback ant-form-item-has-error" }>
							<Input prefix={<User size="14px" className = "site-form-item-icon" />} placeholder="Логін" allowClear disabled={loading} />
						</Form.Item>

						<Form.Item name="password" rules={[{ required: true, whitespace: true, message: 'Введіть пароль!' }, {pattern: /^([0-9a-zA-Z]){6,20}$/, message: 'Має містити від 6 до 20 символів, які містять латинські літери будь-якого регістру і цифри.'} ]} hasFeedback className={ (errors && !change) && "ant-row ant-form-item ant-form-item-has-feedback ant-form-item-has-error" }>
							<Input.Password prefix={<Lock size="14px" className = "site-form-item-icon" />} type="password" placeholder="Пароль" disabled={loading} />
						</Form.Item>

						<Form.Item>
							<Form.Item name="remember" valuePropName="checked" noStyle="noStyle">
								<Checkbox disabled={loading}>Запам'ятати мене</Checkbox>
							</Form.Item>
						</Form.Item>

						<Form.Item>
	                  <Space style={{ "width": "100%" }} direction="vertical" size="large">
	                     <Row justify="center">
	                        <Col>
	                           <Button disabled={loading} style={{ "fontSize": "24px", "height": "60px" }} size="large" type="primary" htmlType="submit">
	                              Увійти
	                           </Button>
	                        </Col>
	                     </Row>
	   						<Row justify="center">
	                        <Col>
	                           <Space size="small" direction="vertical" style={{ "textAlign": "center" }}>
	                              <p>
	                                 <span style={{ "color": "333333", "fontWeight": "600" }}>Все ще немає акканту?&nbsp;</span>
	                                 <Link className="login-form-forgot" to="/join">Приєднатися</Link>
	                              </p>
	                           </Space>
	                        </Col>
	                     </Row>
	                  </Space>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</div>
	);
};

export default SignIn;
