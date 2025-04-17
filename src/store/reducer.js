import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducer import
import customizationReducer from './customizationReducer';
import accountReducer from './accountReducer';
import userReducer from './userReducer'; // Update the path accordingly
import certificateDomainReducer from './certificateDomainReducer'

//-----------------------|| COMBINE REDUCER ||-----------------------//

const rootReducer = combineReducers({
    account: persistReducer(
        {
            key: 'account',
            storage,
            keyPrefix: 'berry-'
        },
        accountReducer
    ),
    customization: customizationReducer,
    user: userReducer,
    domainCeretifctaes: certificateDomainReducer // Include the userReducer in the combined reducer
});

export default rootReducer;
