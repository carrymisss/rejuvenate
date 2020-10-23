import React, { useState } from 'react';
import { Button, Col, Row, Card, Divider, Alert, Modal, message } from 'antd';
import SettingsInfo from './Settings/SettingsInfo';
import SettingsAvatar from './Settings/SettingsAvatar';
import SettingsEmail from './Settings/SettingsEmail';
import SettingsPassword from './Settings/SettingsPassword';
import { GearWideConnected } from 'react-bootstrap-icons';
import {  useHistory } from 'react-router-dom';
import axios from 'axios';


const Settings = ({ currentUserAvatar, isVerify, currentUserName, currentUserFullname, currentAccountID, currentUserEmail, setPreload, setInitialData, setNewAvatar, setNewUsername, setNewFullname, setNewEmail }) => {
	const [modalDelete, setModalDelete] = useState(false);

	const history = useHistory();

	const showModalDelete = () => { setModalDelete(true); }

	const hideModalDelete = () => { setModalDelete(false) }

	const confirmModalDelete = () => {
		setModalDelete(false);
		setPreload(true);
		axios.post('/api/user/deleteaccount', {id: currentAccountID}).then(({ data }) => {
			if (data.statusCode === 200) {
				setTimeout(() => {
	            setInitialData({
	               currentAccountID: null,
	               currentUserFullname: null,
	               currentUserName: null,
						currentUserEmail: null,
	               isUserLogin: false,
	               isVerify: null,
	               currentUserAvatar: null,
	            })
	            history.push('/');
	            setPreload(false);
	         }, 200);
				setPreload(false);
			} else {
				setPreload(false);
				setTimeout(() => {
					message.error('Сталася помилка! Спробуйте ще раз.');
				}, 200);
			}
		}).catch(() => {
			setPreload(false);
			message.error('Сталася помилка! Спробуйте ще раз.');
		})
	}

	return (
		<>
		<div className="o-container o-wrapper">
			<Row justify="center" gutter={30} style={{ marginTop : "30px", paddingBottom: "30px" }}>
				<Col span={24} lg={21} xl={18} >
					<Card type="inner" title={<span style={{ fontSize: "1.7rem" }}>Налаштування</span>} extra={<GearWideConnected size={30} />}>
						<SettingsInfo currentUserFullname={currentUserFullname} currentUserName={currentUserName} setInitialData={setInitialData} setNewUsername={setNewUsername} setNewFullname={setNewFullname} />

						<Divider />

						<SettingsAvatar currentUserAvatar={currentUserAvatar} setNewAvatar={setNewAvatar} />

						<Divider />

						<SettingsEmail currentUserEmail={currentUserEmail} isVerify={isVerify} setNewEmail={setNewEmail} />

						<Divider />

						<SettingsPassword />

						<Divider />

						<h4 className="c-settings__title c-settings__title_red">Видалити аккаунт</h4>
						<Alert message={
								<p style={{ fontSize: "1.0625rem" }}>Щойно ви видалите свій обліковий запис, шляху назад вже не буде. Будьте певні.</p>
							}
							description={
								<div style={{ display: "flex", justifyContent: "flex-end" }}>
									<Button type="danger" onClick={showModalDelete}>Видалити аккаунт</Button>
								</div>
							}
							type="error" />
					</Card>
				</Col>
			</Row>
		</div>

		<Modal
	    	title="Впевнені, що хочете видалити аккаунт?"
	    	visible={modalDelete}
    		onOk={hideModalDelete}
	    	onCancel={hideModalDelete}
			footer={null}
			closeIcon={<span className="c-modal-close"></span>}>
			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<Button type="ghost" style={{ backgroundColor: "#D0D3D4" }} onClick={hideModalDelete}>
					<span><b>Ні, я передумав</b></span>
				</Button>
				<Button type="danger" onClick={confirmModalDelete}>
					<span>Так, видалити</span>
				</Button>
			</div>
  		</Modal>
		</>
	);
}

export default Settings;
