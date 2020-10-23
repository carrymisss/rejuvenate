const initialState = {
   currentAccountID: null,
   currentUserFullname: null,
   currentUserName: null,
   isUserLogin: null,
   currentUserAvatar: null,
   currentUserEmail: null,
   isVerify: null,
};

export default (state = initialState, action) => {
   switch (action.type) {
      case "SET_INITIAL_DATA":
         return {
            ...state,
            currentAccountID: action.payload.currentAccountID,
            currentUserFullname: action.payload.currentUserFullname,
            currentUserName: action.payload.currentUserName,
            isUserLogin: action.payload.isUserLogin,
            currentUserAvatar: action.payload.currentUserAvatar,
            currentUserEmail: action.payload.currentUserEmail,
            isVerify: action.payload.isVerify,
         };
      case "SET_NEW_AVATAR":
         return {
            ...state,
            currentUserAvatar: action.payload.newAvatar,
         }
         case "SET_NEW_USERNAME":
            return {
               ...state,
               currentUserName: action.payload,
            }
         case "SET_NEW_FULLNAME":
            return {
               ...state,
               currentUserFullname: action.payload,
            }
         case "SET_NEW_EMAIL":
            return {
               ...state,
               currentUserEmail: action.payload,
            }
      default: return state;
   }
};
