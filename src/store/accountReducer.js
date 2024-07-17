// action - state management
import { LOGIN, LOGOUT, REGISTER } from './actions';

// ==============================|| ACCOUNT REDUCER ||============================== //

const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    organization: null,
    modules: null
};

// eslint-disable-next-line
const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER: {
            const { user } = action.payload;
            return {
                ...state,
                user
            };
        }
        case LOGIN: {
            const { user, organization, modules } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                isInitialized: true,
                user,
                organization,
                modules
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isInitialized: true,
                isLoggedIn: false,
                user: null,
                organization: null,
                modules: null
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
