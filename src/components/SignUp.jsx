import React, { useState } from 'react';
import { Form, Input, Tooltip, Row, Col, Checkbox, Button, message } from 'antd';
import { Link, useHistory } from "react-router-dom";
import { QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const formItemLayout = {
   labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
   },
   wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
   },
};
const tailFormItemLayout = {
   wrapperCol: {
      xs: {
         span: 24,
         offset: 0,
      },
      sm: {
         span: 17,
         offset: 7,
      },
   },
};
const tailFormItemLayout2 = {
   wrapperCol: {
      span: 24,
      offset: 0,
   },
};

const SignUp = ({ setInitialData, setPreload }) => {
   const [errors, setErrors] = useState(false);
	const [loading, setLoading] = useState(false);
	const [change, setChange] = useState(false);

   const [form] = Form.useForm();

   const history = useHistory();

   const onFinish = values => {
      setLoading(true);
      axios.post('/api/user/registration', values).then(({ data }) => {
			if (data.registerStatus === 200) {
            setPreload(true);
            setLoading(false);
				axios.post('/api/user/initial').then(({ data }) => {
		         setInitialData(data);
               setTimeout(() => {
                  history.push('/');
                  setPreload(false);
               }, 200);
		      });
			} else {
            setLoading(false);
            setChange(false);
            setLoading(false);
            setErrors(true);
            message.error('Нікнейм вже існує!');
			}
      }).catch(() => {
         setLoading(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		});
   };

  return (
   <div className="o-container o-wrapper">
      <Row justify="center" gutter={30} style={{ margin: "0" }}>
         <Col span={24} lg={18} xl={13}>
            <Form {...formItemLayout} form={form} name="register_form" onFinish={onFinish} scrollToFirstError className="c-form" onValuesChange={() => setChange(true)}>
               <Form.Item name="email" label="E-mail" rules={[ { type: 'email', message: 'Введіть корректний E-mail!', }, { required: true, message: 'Введіть E-mail!', }, ]} hasFeedback>
                  <Input allowClear disabled={loading} />
               </Form.Item>

               <Form.Item name="username" label={
                  <span>
                     Нікнейм&nbsp;
                     <Tooltip title="Має бути унікальним.">
                        <QuestionCircleOutlined />
                     </Tooltip>
                  </span>
               } rules={[{ required: true, message: 'Введіть нікнейм!', whitespace: true }, {pattern: /^(?=[^-A-Z])(?=.*[a-z])[a-zA-Z0-9-_]{3,12}(?<![-])$/, message: 'Має містити від 3 до 12 символів, які складаються з латинських літер будь-якого регістру, цифр та символів \'-\', \'_\'. Не може починатися та закінчуватися на \'-\'.'} ]} hasFeedback className={ (errors && !change) && "ant-row ant-form-item ant-form-item-has-feedback ant-form-item-has-error" } >
                     <Input allowClear disabled={loading} />
               </Form.Item>

               <Form.Item name="fullname" label={<span>Ім&rsquo;я</span>} rules={[ { max: 20, message: "Має містити максимум 20 будь-яких символів." } ]} hasFeedback>
                     <Input allowClear disabled={loading} />
               </Form.Item>

               <Form.Item name="password" label="Пароль" rules={[ { required: true, whitespace: true, message: 'Введіть свій пароль!', }, {pattern: /^([0-9a-zA-Z]){6,20}$/, message: 'Має містити від 6 до 20 символів, які містять латинські літери будь-якого регістру і цифри.'}, ]} hasFeedback>
                  <Input.Password disabled={loading} />
               </Form.Item>

               <Form.Item name="passwordConfirm" label="Підтвердити пароль" dependencies={[ 'password']} hasFeedback rules={[ { required: true, whitespace: true, message: 'Підтвердіть свій пароль!', }, ({ getFieldValue })=> ({ validator(rule, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject('Паролі не співпадають!'); }, }), ]}>
                  <Input.Password disabled={loading} />
               </Form.Item>

               <Form.Item name="agreement" valuePropName="checked" rules={[ { validator:(_, value)=> value ? Promise.resolve() : Promise.reject('Треба прийняти Умови користування!') }, ]} {...tailFormItemLayout}>
                  <Checkbox disabled={loading}>Я приймаю Умови користування</Checkbox>
               </Form.Item>

               <Form.Item {...tailFormItemLayout2}>
                  <Row justify="center">
                     <Col>
                        <Button disabled={loading} style={{ "fontSize": "24px", "height": "60px", "marginTop": "20px" }} size="large" type="primary" htmlType="submit">
                           Приєднатися
                        </Button>
                     </Col>
                  </Row>
               </Form.Item>
               <Row justify="center">
                  <Col>
                     <Link to="/login">Вже маєте аккаунт?</Link>
                  </Col>
               </Row>
            </Form>
         </Col>
      </Row>
   </div>
  );
};

export default SignUp;
