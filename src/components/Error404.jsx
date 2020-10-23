import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const Error404 = () => (
	<Result
		status="404"
		title="404"
		subTitle="Вибачте, цієї сторінки не існує."
		extra={<Link to="/"><Button type="primary">На головну</Button></Link>}
   />)

export default Error404;
