import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const Error403 = () => (
	<Result
		status="403"
		title="403"
		subTitle="Доступ заборонено."
		extra={<Link to="/"><Button type="primary">На головну</Button></Link>}
   />)

export default Error403;
