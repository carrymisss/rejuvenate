import React from 'react';
import { EmojiDizzy } from 'react-bootstrap-icons';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
		return (
			<div className="c-error-boundary">
				<EmojiDizzy size={70} />
				<p>Сталась фатальна помилка</p>
			</div>
		);
	}

	return this.props.children;
	}
}

export default ErrorBoundary;
