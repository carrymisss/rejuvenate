import React from 'react';
import { Spin } from 'antd';



const PreLoader = () => {
	return(
		<div className="c-global-preloader">
			<Spin size="large" style={{ transform: "scale(1.6)" }} />
			{ /*<svg id="preloader">
			  <g>
			    <path d="M 50,100 A 1,1 0 0 1 50,0"/>
			  </g>
			  <g>
			    <path d="M 50,75 A 1,1 0 0 0 50,-25"/>
			  </g>
			  <defs>
			    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
			      <stop offset="0%" style={{stopColor: "#8E2DE2", stopOpacity: "1"}} />
					<stop offset="1000%" style={{stopColor: "#782fef", stopOpacity: "1"}} />
			    </linearGradient>
			  </defs>
		  </svg> */}
		</div>
	)
}

export default PreLoader;
