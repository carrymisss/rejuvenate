import React, { useState } from 'react';
import { Avatar, Modal, Button } from 'antd';
import CropperImage from '../CropperImage';


const SettingsAvatar = ({ currentUserAvatar, setNewAvatar }) => {
	const [modalCropper, setModalCropper] = useState(false);

	const showModalCropper = () => { setModalCropper(true); }

	const hideModalCropper = () => { setModalCropper(false) }

	return (
		<>
		<h4 className="c-settings__title">Зображення профілю</h4>
		<div className="c-settings-img">
			<Avatar id="avatarImg" className="c-settings-img__img" shape="square" size={100} src={currentUserAvatar} />
			<div className="c-settings-img__description">
				<Button id="addPictureButton" type="ghost" style={{ backgroundColor: "#D0D3D4" }} className="c-btn-add-image" onClick={showModalCropper}>&emsp;Добавити фото&emsp;</Button>
				<p>Ви можете завантажити зображення у форматі JPG, GIF або PNG та не більше 3MB.</p>
			</div>
		</div>

		<Modal
			title="Завантаження нової фотографії"
			visible={modalCropper}
			onOk={hideModalCropper}
			onCancel={hideModalCropper}
			footer={null}
			width={600}
			maskClosable={false}
			closeIcon={<span className="c-modal-close"></span>} >
				<CropperImage setModalCropper={setModalCropper} setGlobalAvatar={setNewAvatar} />
		</Modal>
		</>
	)
}

export default SettingsAvatar;
