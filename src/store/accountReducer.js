// action - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT ,SET_USER_PROFILE} from './actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    isAdmin:false,
    isSubscribed:[]

    
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {

    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
             const { isLoggedIn, user, token, isAdmin ,isSubscribed} = action.payload;

            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token,
                user,
                isAdmin,
                isSubscribed
            };
        }
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                user: null,
                isAdmin:false,
                isSubscribed:[]
            };
        }
        case SET_USER_PROFILE: {
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload, 
                },
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
