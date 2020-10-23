import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Col, Row, Button, Card, Tooltip, Modal, message, Checkbox, Form, Spin } from 'antd';
import axios from 'axios';


// const layout = {
// 	labelCol: { span: 12 },
// 	wrapperCol: { span: 12 },
// };

const UserTabPins = ({ userPins, currentUserName, currentAccountID }) =>  {
	const [modalPins, setModalPins] = useState(false);
	const [spinning, setSpinning] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pinOptions, setPinOptions] = useState();
	const [currentPins, setCurrentPins] = useState([]);
	const [pinBlocked, setPinBlocked] = useState(false);

	const { username } = useParams();

	const [form] = Form.useForm();

	// useEffect(() => {
	//
	// }, [pinOptions]);

	const showModalPins = () => {
		// setPinOptions(
			// userPins.map(el => {
			// 	return { label: el.slug, value: parseInt(el.id)}
			// })
		// )
		setSpinning(true);
		axios.post('/api/user/editpins').then(({ data }) => {
			// console.log(data.pins);
			// setIsUserFollowing(!isUserFollowing);
			// setButtonFollowLoad(false);
			// setSpinning(false);
			// data.pins.map(el => console.log(el))
			console.log(data, 'data');
			if (data.statusCode === 200) {
				setSpinning(false);
				let jh = data.pins.map(el => {
					return { label: el.slug, value: parseInt(el.id)}
				});
				// // console.log(jh);
				setPinOptions(data.pins);
				console.log(pinOptions);
				// let hh = data.pins.filter(el => el.isPined);
				// setCurrentPins(hh.map(el => el.id));
				// form.setFieldsValue({ pins_checkbox: hh.map(el => el.id) })
					// setPinOptions(
					// 	data.pins.map(el => {
					// 		return { label: el.slug, value: parseInt(el.id)}
					// 	})
					// );
				// setCurrentPins(
				// 	data.pins.map(el => {
				// 		return { label: el.slug, value: parseInt(el.id)}
				// 	}));
				// console.log(currentPins);
			} else {
				message.error('Сталася помилка! Спробуйте ще раз.');
			}
		}).catch((reject) => {
			setSpinning(false);
			message.error('Сталася помилка! Спробуйте ще раз.'+reject);
		});
		setModalPins(true);
	}


	const hideModalPins = () => {
		setModalPins(false);
		// setPinOptions([]);
		// setCurrentPins([]);
	}

	const onPinChange = (checkedValues) => {
		console.log('checked = ', checkedValues);
	}

	const onFinish = values => {
		console.log('Received values of form: ', values);
	};

	return (
		<>
		<div style={{ width: "100%", minHeight: "460px" }}>
			<Row justify="space-between" align="center" style={{ marginBottom: "16px", width: "100%" }}>
				<span style={{ fontSize: "16px", display: "inline-flex", alignItems: "center" }}>Вибрані статті</span>
				{ currentUserName === username && <Button onClick={showModalPins} size="small" type="ghost" style={{ fontSize: "12px" }}>Налаштувати піни</Button> }
			</Row>
			<Row gutter={[30, 16]} >
				{ userPins.map(el =>
					<Col span={24} lg={12} key={Math.random() * (2147483647 - (-2147483647)) + 2147483647}>
						<Card>
							<Tooltip placement="topLeft" title={el.title}>
								<Link to={`/${el.authorID}/view/${el.articleID}`} className="c-article-pin__title">{el.title} {el.articleID}</Link>
							</Tooltip>
						   <time style={{ color: "#6c757d", marginTop: "5px", display: "block" }}>{el.date}</time>
							<p style={{ margin: "0", marginTop: "10px" }}>{el.content.substring(0, 225)}&hellip;</p>
						</Card>
					</Col>
				) }
			</Row>
		</div>

		<Modal
		title="Редагувати закріплені статті"
		visible={modalPins}
		onOk={hideModalPins}
		onCancel={hideModalPins}
		centered
		footer={null}
		closeIcon={<span className="c-modal-close"></span>}>
		   <Spin spinning={spinning} size="large">
				<Form form={form} name="pin_edit" onFinish={onFinish} initialValues={{pins_checkbox: currentPins}}>
					<Form.Item name="pins_checkbox" label="">
						<Checkbox.Group disabled={loading || pinBlocked} onChange={onPinChange}>
							
						</Checkbox.Group>
					</Form.Item>
					<Row justify="end">
						<Form.Item style={{ marginBottom: "0" }}>
							<Button key="submit" className="c-btn__green" type="ghost" htmlType="submit" loading={loading}>
								Зберегти
							</Button>
						</Form.Item>
					</Row>
				</Form>
			</Spin>
      </Modal>
		</>
	)
}

export default UserTabPins;
