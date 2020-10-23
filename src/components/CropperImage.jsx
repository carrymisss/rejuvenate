import React, { useState, useRef } from 'react';
import { Upload, message, Button, Col, Row, Space, Divider, Spin } from 'antd';
import { CloudUploadFill } from 'react-bootstrap-icons';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import axios from 'axios';


const CropperImage = ({ setModalCropper, setGlobalAvatar }) => {
	const [image, setImage] = useState('');
	const [imageName, setImageName] = useState('');
	// const [cropper, setCropper] = useState([]);
	const [fileList, setFileList] = useState([]);
	const [imageLoading, setImageLoading] = useState(false);
	const newCropped = useRef(null);

	const getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	const sendImg = () => {
		setImageLoading(true);
		const d = { newAvatar: newCropped.current.getCroppedCanvas({width: 300, height: 300}).toDataURL() }
		axios.post('/api/user/updateimg', d).then((response) => {
			setGlobalAvatar(d);
			setModalCropper(false);
			setImageName('');
			setImage('');
			setFileList([]);
			setImageLoading(false);
			message.success(`${imageName.length > 25 ? imageName.substring(0, 25)+'...'+imageName.substr(imageName.length - 4) : imageName.substring(0, 25)} завантажено успішно!`);
		})
		.catch(() => {
			setImageLoading(false);
			message.error(`${imageName.length > 25 ? imageName.substring(0, 25)+'...'+imageName.substr(imageName.length - 4) : imageName.substring(0, 25)} не завантажено. Спробуйте ще раз!`);
		});
	}

	const uploadProps = {
		accept: '.png, .jpeg, .gif, .jpg',
		multiple: false,
		showUploadList: false,
		fileList,
	  	onRemove() {
		  	setImage('');
			setImageName('');
			setFileList([]);
	  	},
		beforeUploading(file) {
			return false;
		},
	  	onChange(info) {
			 if (info.fileList[0].status === 'error') {
				message.error(`${info.fileList[0].name} upload failed.`);
			}
			const isJpgOrPng = info.fileList[0].type === 'image/jpeg' || info.fileList[0].type === 'image/png' || info.fileList[0].type === 'image/gif';
			const isLt2M = info.fileList[0].size / 1024 / 1024 < 3;
	  		if (!isJpgOrPng) {
	  			message.error('Ви можете завантажити тільки JPG, PNG або GIF файли!');
	  		} else if (!isLt2M) {
	  			message.error('Зображення має бути менше 3MB!');
	  		} else {
				getBase64(info.fileList[0].originFileObj, imageUrl =>
					setImage(imageUrl),
					setImageName(info.fileList[0].name),
				);
			}
	  	},
	};

	const deleteImg = () => {
		setImage('');
		setImageName('');
		setFileList([]);
	}


	return (
		<>
		<Row>
			<Col span={24}>
					{ image
						? <Spin spinning={imageLoading} size="large" className="pos-c-l">
								<Cropper
										src={ image }
										style={{ maxHeight: "600px" }}
										aspectRatio={1 / 1}
										viewMode={2}
										autoCropArea={.5}
										modal={true}
										background={false}
										highlight={true}
										dragMode="move"
										responsive={true}
										minContainerHeight={400}
										minCropBoxWidth={100}
										minCropBoxHeight={100}
										ref={newCropped} />
							</Spin>
						:  <Upload.Dragger {...uploadProps}>
								<p className="ant-upload-drag-icon">
									<CloudUploadFill size={50} />
								</p>
								<p className="ant-upload-text">Нажміть або перетягніть файл для завантаження</p>
							</Upload.Dragger>
					}
			</Col>
		</Row>
		{ image && <>
			<Divider />
			<Row justify="end" gutter={[30, 0]} style={{ marginBottom: "0" }}>
				<Col>
					<Space direction="horizontal" size="middle">
						<Button type="ghost" style={{ backgroundColor: "#D0D3D4" }} onClick={deleteImg} loading={imageLoading}>Назад</Button>
						<Button type="primary" onClick={sendImg} loading={imageLoading}>Зберегти</Button>
					</Space>
				</Col>
			</Row>
			</> }
		</>
	)
}

export default CropperImage;
