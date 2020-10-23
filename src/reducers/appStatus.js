const initialState = {
	appStatus: 200,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_APP_STATUS":
      return {
        ...state,
		  appStatus: action.payload,
      };
    default:
      return state;
  }
};
